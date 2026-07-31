<h1>
  <span class="headline">Atelier CRM</span>
  <span class="subhead">Recording Interaction History</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to create a nested interaction endpoint and render a customer communication timeline.

## Why interactions need their own model

A contact note describes the person generally. An interaction records a specific event that happened at a specific time.

Examples:

- Sent product photos through WhatsApp
- Customer requested a different color on Instagram
- Called to confirm a showroom appointment
- Added an internal note about the next step

## Create the model

Add to `crm/models.py`:

```python
from django.utils import timezone


class Interaction(models.Model):
    CHANNEL_CHOICES = [
        ('phone', 'Phone'),
        ('whatsapp', 'WhatsApp'),
        ('instagram', 'Instagram'),
        ('email', 'Email'),
        ('in_person', 'In person'),
        ('note', 'Internal note'),
    ]

    opportunity = models.ForeignKey(
        Opportunity,
        on_delete=models.CASCADE,
        related_name='interactions',
    )
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    summary = models.TextField()
    occurred_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-occurred_at']
```

Migrate and register it in admin.

## Create the serializer

```python
class InteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interaction
        fields = '__all__'
        read_only_fields = ('opportunity',)
```

The URL determines the opportunity. The client should not be able to put the interaction under one URL while sending a different opportunity ID in the body.

Add interactions to `OpportunitySerializer`:

```python
interactions = InteractionSerializer(many=True, read_only=True)
```

## Create a nested endpoint

```python
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
        return Response(
            InteractionSerializer(interactions, many=True).data
        )

    serializer = InteractionSerializer(data=request.data)

    if serializer.is_valid():
        interaction = serializer.save(opportunity=opportunity)
        return Response(
            InteractionSerializer(interaction).data,
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

Add the URL:

```python
path(
    'opportunities/<int:opportunity_id>/interactions/',
    views.interaction_list,
),
```

## Test in Postman

```text
POST /api/opportunities/1/interactions/
```

```json
{
  "channel": "instagram",
  "summary": "Customer asked whether the item is available in black."
}
```

## Add the React service

```javascript
export const createInteraction = (opportunityId, formData) => apiFetch(
  `/opportunities/${opportunityId}/interactions/`,
  {
    method: 'POST',
    body: JSON.stringify(formData),
  },
)
```

## Build the controlled form

Use the form pattern students already know:

```jsx
const initialState = {
  channel: 'whatsapp',
  summary: '',
}

const [formData, setFormData] = useState(initialState)
```

After a successful POST, add the returned interaction to the beginning of the array:

```jsx
const handleCreateInteraction = async (formData) => {
  const interaction = await opportunityService.createInteraction(
    opportunityId,
    formData,
  )

  setOpportunity({
    ...opportunity,
    interactions: [interaction, ...opportunity.interactions],
  })
}
```

## Render the timeline

```jsx
{opportunity.interactions.map((interaction) => (
  <article key={interaction.id}>
    <p>{interaction.channel}</p>
    <time>
      {new Date(interaction.occurred_at).toLocaleString()}
    </time>
    <p>{interaction.summary}</p>
  </article>
))}
```

The CRM stores a useful summary, not the entire private conversation.

## Check for understanding

1. Why not store interactions in one large Contact notes field?
2. Why is `opportunity` read-only in the serializer?
3. Where does the opportunity ID come from?
4. Why prepend the new interaction?
5. What information should staff avoid copying into a CRM note?
