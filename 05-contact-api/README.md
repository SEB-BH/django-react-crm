<h1>
  <span class="headline">Atelier CRM</span>
  <span class="subhead">Contact CRUD API</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to build and test RESTful CRUD endpoints with serializers and function-based API views.

## Create the serializer

Create `crm/serializers.py`:

```python
from rest_framework import serializers
from .models import Contact


class ContactSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Contact
        fields = '__all__'

    def get_full_name(self, contact):
        return f'{contact.first_name} {contact.last_name}'
```

`fields = '__all__'` includes every model field. `full_name` is extra read-only display data.

## Build the collection endpoint

Open `crm/views.py`:

```python
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Contact
from .serializers import ContactSerializer


@api_view(['GET', 'POST'])
def contact_list(request):
    if request.method == 'GET':
        contacts = Contact.objects.all()
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data)

    serializer = ContactSerializer(data=request.data)

    if serializer.is_valid():
        contact = serializer.save()
        return Response(
            ContactSerializer(contact).data,
            status=status.HTTP_201_CREATED,
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )
```

### Why `many=True`?

`Contact.objects.all()` returns a collection. The serializer needs to know it should serialize many records rather than one record.

### Why validate before saving?

Incoming JSON cannot be trusted. `is_valid()` checks it against serializer and model rules before the database is changed.

## Build the member endpoint

Add to `crm/views.py`:

```python
@api_view(['GET', 'PUT', 'DELETE'])
def contact_detail(request, contact_id):
    try:
        contact = Contact.objects.get(id=contact_id)
    except Contact.DoesNotExist:
        return Response(
            {'message': 'Contact not found.'},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == 'GET':
        return Response(ContactSerializer(contact).data)

    if request.method == 'PUT':
        serializer = ContactSerializer(contact, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    contact.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
```

The serializer receives the existing `contact` instance during an update. Without it, `.save()` would create a new contact.

## Create app URLs

Create `crm/urls.py`:

```python
from django.urls import path
from . import views

urlpatterns = [
    path('contacts/', views.contact_list, name='contact-list'),
    path(
        'contacts/<int:contact_id>/',
        views.contact_detail,
        name='contact-detail',
    ),
]
```

Include these URLs in `config/urls.py`:

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('crm.urls')),
]
```

## Test in Postman

### Read all contacts

```text
GET http://127.0.0.1:8000/api/contacts/
```

### Create a contact

```text
POST http://127.0.0.1:8000/api/contacts/
```

Body → raw → JSON:

```json
{
  "first_name": "Sara",
  "last_name": "Ahmed",
  "email": "sara@example.com",
  "phone": "+973 3900 1000",
  "preferred_channel": "whatsapp",
  "instagram_handle": "sara.travels",
  "notes": "Interested in travel products."
}
```

### Read one contact

```text
GET http://127.0.0.1:8000/api/contacts/1/
```

### Update one contact

```text
PUT http://127.0.0.1:8000/api/contacts/1/
```

A PUT request sends the complete editable record.

### Delete one contact

```text
DELETE http://127.0.0.1:8000/api/contacts/1/
```

A successful delete returns status `204 No Content`.

## REST route table

| Action | Method | URL |
| --- | --- | --- |
| Index | GET | `/api/contacts/` |
| Create | POST | `/api/contacts/` |
| Show | GET | `/api/contacts/:id/` |
| Update | PUT | `/api/contacts/:id/` |
| Delete | DELETE | `/api/contacts/:id/` |

## Check for understanding

1. Why is the serializer given `many=True` for index?
2. Why does update receive both `contact` and `request.data`?
3. Which status code represents successful creation?
4. What response should a missing contact receive?

## You do

Send invalid JSON with no `phone`. Read the serializer's error response and explain where the validation rule came from.
