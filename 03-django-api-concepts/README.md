<h1>
  <span class="headline">Atelier CRM</span>
  <span class="subhead">Django API Concepts for MERN Developers</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to map familiar MERN responsibilities to Django and Django REST Framework.

## The same responsibilities, different tools

| MERN responsibility | Django REST Framework equivalent |
| --- | --- |
| Express application | Django project |
| Feature router | Django app URL file |
| Mongoose schema/model | Django model |
| Express controller function | Django or DRF view function |
| `req` and `res` | `request` and `Response` |
| Request-body validation | Serializer validation |
| MongoDB query methods | Django ORM query methods |
| `populate()` | Related queries and nested serializers |
| Express middleware | Django middleware, permissions, and authentication classes |
| React service file | The same React service-file pattern |

## The request cycle

A React request will travel through the application like this:

```text
React service
    ↓ fetch()
config/urls.py
    ↓ include()
crm/urls.py
    ↓ matching path
crm/views.py
    ↓ ORM + serializer
PostgreSQL
    ↓
JSON Response
    ↓
React state
```

## What does the model do?

A model defines the database structure and gives us methods for querying it.

```python
class Contact(models.Model):
    first_name = models.CharField(max_length=100)
```

This is similar to defining a Mongoose model, but Django migrations create and update relational database tables.

## What does the serializer do?

A Django model instance is a Python object, not JSON. A serializer translates between model data and JSON-compatible data.

It also validates incoming request data before a model is saved.

```python
serializer = ContactSerializer(data=request.data)

if serializer.is_valid():
    contact = serializer.save()
```

A serializer handles part of the work that a Mongoose schema and an Express controller often share.

## What does the view do?

A DRF view receives the request, decides which action to perform, calls the ORM, uses a serializer, and returns a response.

```python
@api_view(['GET', 'POST'])
def contact_list(request):
    if request.method == 'GET':
        # read contacts

    if request.method == 'POST':
        # create a contact
```

This is intentionally close to the controller functions students wrote in Express.

## Why function-based views first?

Django REST Framework also offers generic views and viewsets that can generate more behavior with less code. We will begin with functions so the relationship between a request method and its logic remains visible.

After students can explain the API, a viewset refactor becomes useful rather than magical.

## Why are we not using Django templates?

Django can render HTML on the server, but our client is a React SPA. Django will return JSON, and React will create the interface.

```text
Django templates: Django returns HTML
Our application: Django returns JSON and React returns JSX
```

## ORM comparisons

| Goal | Mongoose | Django ORM |
| --- | --- | --- |
| Read all | `Contact.find()` | `Contact.objects.all()` |
| Read one | `Contact.findById(id)` | `Contact.objects.get(id=id)` |
| Filter | `Contact.find({ source })` | `Contact.objects.filter(source=source)` |
| Create | `Contact.create(data)` | `Contact.objects.create(**data)` or serializer `.save()` |
| Delete | `findByIdAndDelete(id)` | instance `.delete()` |

## Check for understanding

1. Why can we not return a model instance directly as JSON?
2. Which file decides what URL reaches a view?
3. Which layer validates `request.data`?
4. Which Django concept is most similar to an Express controller?
