<h1>
  <span class="headline">Atelier CRM</span>
  <span class="subhead">Opportunities and One-to-Many Relationships</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to connect contacts and opportunities with a foreign key and nested serialized data.

## What is an opportunity?

A contact describes a person. An opportunity describes a possible sale involving that person.

One contact may have many opportunities:

```text
Sara Ahmed
├── Heritage Travel Bag
├── Custom Laptop Case
└── Corporate Gift Order
```

## Create the model

Add to `crm/models.py`:

```python
class Opportunity(models.Model):
    STAGE_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('qualified', 'Qualified'),
        ('proposal', 'Proposal'),
        ('won', 'Won'),
        ('lost', 'Lost'),
    ]

    SOURCE_CHOICES = [
        ('store', 'Store'),
        ('website', 'Website'),
        ('instagram', 'Instagram'),
        ('whatsapp', 'WhatsApp'),
        ('referral', 'Referral'),
        ('other', 'Other'),
    ]

    contact = models.ForeignKey(
        Contact,
        on_delete=models.CASCADE,
        related_name='opportunities',
    )
    title = models.CharField(max_length=150)
    product_name = models.CharField(max_length=150)
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    stage = models.CharField(
        max_length=20,
        choices=STAGE_CHOICES,
        default='new',
    )
    estimated_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )
    next_follow_up = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.title
```

Run migrations and register Opportunity in admin.

## Understand the foreign key

```python
contact = models.ForeignKey(
    Contact,
    on_delete=models.CASCADE,
    related_name='opportunities',
)
```

- `Contact` is the related model.
- `CASCADE` deletes a contact's opportunities if the contact is deleted.
- `related_name='opportunities'` lets us use `contact.opportunities.all()`.

Deleting sales history may not be appropriate in a real CRM. Production systems often archive contacts or use `PROTECT`. We use `CASCADE` here to keep the first relationship predictable.

## Add the serializer

```python
class OpportunitySerializer(serializers.ModelSerializer):
    contact_details = ContactSerializer(source='contact', read_only=True)

    class Meta:
        model = Opportunity
        fields = '__all__'
```

### Write data

React sends a contact ID:

```json
{
  "contact": 4,
  "title": "Limited-edition travel bag",
  "product_name": "Heritage Travel Bag",
  "source": "instagram",
  "stage": "new",
  "estimated_value": 1200,
  "next_follow_up": "2026-08-05"
}
```

### Read data

Django returns the ID plus useful nested details:

```json
{
  "id": 12,
  "contact": 4,
  "contact_details": {
    "id": 4,
    "full_name": "Sara Ahmed",
    "phone": "+973 3900 1000"
  },
  "title": "Limited-edition travel bag"
}
```

The write format stays simple while the read format gives React display data.

## Add API views

```python
@api_view(['GET', 'POST'])
def opportunity_list(request):
    if request.method == 'GET':
        opportunities = Opportunity.objects.select_related('contact')
        return Response(
            OpportunitySerializer(opportunities, many=True).data
        )

    serializer = OpportunitySerializer(data=request.data)

    if serializer.is_valid():
        opportunity = serializer.save()
        return Response(
            OpportunitySerializer(opportunity).data,
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

Add a normal GET/PUT/DELETE detail view using the same pattern as Contact.

Add URLs:

```python
path('opportunities/', views.opportunity_list),
path('opportunities/<int:opportunity_id>/', views.opportunity_detail),
```

## Include opportunities on contact details

In the GET branch of `contact_detail`:

```python
data = ContactSerializer(contact).data
data['opportunities'] = OpportunitySerializer(
    contact.opportunities.all(),
    many=True,
).data
return Response(data)
```

This gives the Contact Details page all opportunities belonging to that contact.

## Build the React form

Create an opportunity service with `index`, `show`, and `create` functions.

Fetch contacts to build the select:

```jsx
<select name="contact" value={formData.contact} onChange={handleChange}>
  <option value="">Choose a contact</option>
  {contacts.map((contact) => (
    <option key={contact.id} value={contact.id}>
      {contact.full_name}
    </option>
  ))}
</select>
```

Before submitting, convert the contact ID and empty date:

```javascript
const payload = {
  ...formData,
  contact: Number(formData.contact),
  next_follow_up: formData.next_follow_up || null,
}
```

HTML select values are strings. The API expects an integer contact ID.

## Check for understanding

1. Why is this relationship one-to-many?
2. What does `related_name` give us?
3. Why does React send an ID instead of a nested contact object?
4. Why do we convert an empty date to `null`?
5. What is one alternative to `CASCADE` in a production CRM?
