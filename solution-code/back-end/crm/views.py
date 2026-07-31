from django.db.models import Sum
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Contact, Interaction, Opportunity
from .serializers import ContactSerializer, InteractionSerializer, OpportunitySerializer


@api_view(['GET', 'POST'])
def contact_list(request):
    if request.method == 'GET':
        contacts = Contact.objects.all()
        return Response(ContactSerializer(contacts, many=True).data)

    serializer = ContactSerializer(data=request.data)
    if serializer.is_valid():
        contact = serializer.save()
        return Response(ContactSerializer(contact).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def contact_detail(request, contact_id):
    try:
        contact = Contact.objects.get(id=contact_id)
    except Contact.DoesNotExist:
        return Response({'message': 'Contact not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        data = ContactSerializer(contact).data
        data['opportunities'] = OpportunitySerializer(
            contact.opportunities.all(),
            many=True,
        ).data
        return Response(data)

    if request.method == 'PUT':
        serializer = ContactSerializer(contact, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    contact.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def opportunity_list(request):
    if request.method == 'GET':
        opportunities = Opportunity.objects.select_related('contact', 'assigned_to')

        stage = request.query_params.get('stage')
        source = request.query_params.get('source')
        contact_id = request.query_params.get('contact')

        if stage:
            opportunities = opportunities.filter(stage=stage)
        if source:
            opportunities = opportunities.filter(source=source)
        if contact_id:
            opportunities = opportunities.filter(contact_id=contact_id)

        return Response(OpportunitySerializer(opportunities, many=True).data)

    serializer = OpportunitySerializer(data=request.data)
    if serializer.is_valid():
        opportunity = serializer.save(assigned_to=request.user)
        return Response(
            OpportunitySerializer(opportunity).data,
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def opportunity_detail(request, opportunity_id):
    try:
        opportunity = Opportunity.objects.select_related(
            'contact',
            'assigned_to',
        ).prefetch_related('interactions').get(id=opportunity_id)
    except Opportunity.DoesNotExist:
        return Response(
            {'message': 'Opportunity not found.'},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == 'GET':
        return Response(OpportunitySerializer(opportunity).data)

    if request.method in ['PUT', 'PATCH']:
        serializer = OpportunitySerializer(
            opportunity,
            data=request.data,
            partial=request.method == 'PATCH',
        )
        if serializer.is_valid():
            serializer.save(assigned_to=opportunity.assigned_to or request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    opportunity.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def interaction_list(request, opportunity_id):
    try:
        opportunity = Opportunity.objects.get(id=opportunity_id)
    except Opportunity.DoesNotExist:
        return Response(
            {'message': 'Opportunity not found.'},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == 'GET':
        interactions = opportunity.interactions.all()
        return Response(InteractionSerializer(interactions, many=True).data)

    serializer = InteractionSerializer(data=request.data)
    if serializer.is_valid():
        interaction = serializer.save(
            opportunity=opportunity,
            created_by=request.user,
        )
        return Response(
            InteractionSerializer(interaction).data,
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def dashboard(request):
    today = timezone.localdate()
    open_opportunities = Opportunity.objects.exclude(stage__in=['won', 'lost'])
    pipeline_value = open_opportunities.aggregate(total=Sum('estimated_value'))['total'] or 0

    opportunities_by_stage = {
        stage: Opportunity.objects.filter(stage=stage).count()
        for stage, _label in Opportunity.STAGE_CHOICES
    }

    upcoming_follow_ups = open_opportunities.filter(
        next_follow_up__isnull=False,
    ).select_related('contact').order_by('next_follow_up')[:5]

    data = {
        'contact_count': Contact.objects.count(),
        'open_opportunities': open_opportunities.count(),
        'pipeline_value': pipeline_value,
        'won_opportunities': Opportunity.objects.filter(stage='won').count(),
        'follow_ups_due': open_opportunities.filter(next_follow_up__lte=today).count(),
        'opportunities_by_stage': opportunities_by_stage,
        'upcoming_follow_ups': OpportunitySerializer(upcoming_follow_ups, many=True).data,
    }
    return Response(data)
