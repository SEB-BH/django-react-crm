<h1>
  <span class="headline">Atelier CRM</span>
  <span class="subhead">Django REST Framework Setup</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to create and configure a Django REST Framework API using a virtual environment and PostgreSQL.

## Create the project directory

```bash
mkdir atelier-crm
cd atelier-crm
mkdir back-end
cd back-end
```

## Create a virtual environment

A Python virtual environment serves a similar purpose to a project's local `node_modules`: it keeps this project's dependencies separate from other Python projects.

### Create on macOS

```bash
python3 -m venv .venv
```

### Create in Windows Git Bash

```bash
python -m venv .venv
```

### Activate on macOS

```bash
source .venv/bin/activate
```

### Activate in Windows Git Bash

```bash
source .venv/Scripts/activate
```

After activation, your terminal prompt should begin with `(.venv)`.

## Install dependencies

```bash
pip install django djangorestframework django-cors-headers psycopg[binary] python-dotenv djangorestframework-simplejwt
pip freeze > requirements.txt
```

We are installing authentication now, but we will not use it until the API works without authentication.

## Create the Django project and app

```bash
django-admin startproject config .
python manage.py startapp crm
```

The `.` tells Django to create the project files in the current directory.

Your structure should now include:

```text
back-end/
├── .venv/
├── config/
│   ├── settings.py
│   └── urls.py
├── crm/
│   ├── models.py
│   ├── views.py
│   └── admin.py
├── manage.py
└── requirements.txt
```

## Project versus app

- The **project** named `config` contains settings for the whole backend.
- The **app** named `crm` contains the business feature we are building.

For this lesson, Contacts, Opportunities, and Interactions all belong to the same business domain, so they will stay in one Django app.

## Create the PostgreSQL database

```bash
createdb atelier_crm
```

If your PostgreSQL installation requires a username, use your local PostgreSQL setup from Installfest.

## Add environment variables

Create `.env`:

```env
SECRET_KEY=replace-this-with-a-random-development-key
DEBUG=True
POSTGRES_DB=atelier_crm
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

Add `.env` and `.venv/` to `.gitignore`.

## Update `config/settings.py`

At the top of the file:

```python
import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

SECRET_KEY = os.getenv('SECRET_KEY')
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
```

Add our packages and app to `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'crm',
]
```

Add CORS middleware near the top:

```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    # existing middleware continues here
]
```

Replace `DATABASES`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB'),
        'USER': os.getenv('POSTGRES_USER', ''),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', ''),
        'HOST': os.getenv('POSTGRES_HOST', 'localhost'),
        'PORT': os.getenv('POSTGRES_PORT', '5432'),
    }
}
```

Add the React development origin:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
]
```

During the first part of the build, allow API requests without login:

```python
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
}
```

We will replace this in the authentication microlesson.

Set the class timezone:

```python
TIME_ZONE = 'Asia/Bahrain'
USE_TZ = True
```

## Run the initial migrations

```bash
python manage.py migrate
python manage.py runserver
```

Open `http://127.0.0.1:8000/admin/`. A login page confirms that Django is running.

## Python reminders

Python uses indentation instead of curly braces:

```python
if request.method == 'GET':
    return Response(data)
```

Python dictionaries resemble JavaScript objects:

```python
contact = {
    'first_name': 'Sara',
    'phone': '+973 3900 1000',
}
```

Django imports often begin with `from`:

```python
from django.db import models
```

## Check for understanding

1. What does the virtual environment isolate?
2. What is the difference between `config` and `crm`?
3. Why does the backend need CORS configuration?
4. Which directory should contain `manage.py`?
