from rest_framework import serializers
from .models import Contact, Interaction, Opportunity


class ContactSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Contact
        fields = '__all__'

    def get_full_name(self, contact):
        return f'{contact.first_name} {contact.last_name}'


class InteractionSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(
        source='created_by.username',
        read_only=True,
    )

    class Meta:
        model = Interaction
        fields = '__all__'
        read_only_fields = ('opportunity', 'created_by')


class OpportunitySerializer(serializers.ModelSerializer):
    contact_details = ContactSerializer(source='contact', read_only=True)
    assigned_to_name = serializers.CharField(
        source='assigned_to.username',
        read_only=True,
    )
    interactions = InteractionSerializer(many=True, read_only=True)

    class Meta:
        model = Opportunity
        fields = '__all__'
        read_only_fields = ('assigned_to',)
