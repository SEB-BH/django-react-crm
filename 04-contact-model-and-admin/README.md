<h1>
  <span class="headline">Atelier CRM</span>
  <span class="subhead">Contact Model and Django Admin</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to create a Django model, migrate it, and manage records through Django admin.

## Create the Contact model

Open `crm/models.py`:

```python
from django.db import models


class Contact(models.Model):
    CHANNEL_CHOICES = [
        ('phone', 'Phone'),
        ('whatsapp', 'WhatsApp'),
        ('instagram', 'Instagram'),
        ('email', 'Email'),
        ('in_person', 'In person'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30)
    preferred_channel = models.CharField(
        max_length=20,
        choices=CHANNEL_CHOICES,
        default='whatsapp',
    )
    instagram_handle = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
```

## Field choices

Django stores the first value and displays the second value:

```python
('whatsapp', 'WhatsApp')
```

The database stores `whatsapp`. The admin and model helpers can display `WhatsApp`.

Choices reduce inconsistent values such as `Whats App`, `whatsapp`, and `WhatsApp`.

## Blank versus null

For text fields, we use `blank=True` when a form may leave the value empty.

We usually avoid `null=True` on text fields so there is one empty value, `''`, rather than both an empty string and `NULL`.

## Create and apply a migration

```bash
python manage.py makemigrations
python manage.py migrate
```

- `makemigrations` creates instructions describing the schema change.
- `migrate` applies those instructions to the database.

Whenever a model changes, run both commands.

## Register the model in admin

Open `crm/admin.py`:

```python
from django.contrib import admin
from .models import Contact


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = (
        'first_name',
        'last_name',
        'phone',
        'preferred_channel',
    )
    search_fields = ('first_name', 'last_name', 'email', 'phone')
```

## Create an admin user

```bash
python manage.py createsuperuser
```

Start Django and log in at `http://127.0.0.1:8000/admin/`.

Create at least two contacts through admin.

## Try the ORM shell

```bash
python manage.py shell
```

Django 5.2 automatically imports installed models into the shell. Try:

```python
Contact.objects.all()
Contact.objects.count()
Contact.objects.filter(preferred_channel='whatsapp')
Contact.objects.get(id=1)
```

Exit:

```python
exit()
```

## Check for understanding

1. What is the difference between `makemigrations` and `migrate`?
2. Why do we define `__str__`?
3. What is stored for the WhatsApp choice?
4. Does Django admin replace the React frontend?

Django admin is an internal management tool. The React application will be the purpose-built interface for staff.

## You do

Add one optional `company` field to Contact. Migrate the change, update admin, and create a contact with a company.
