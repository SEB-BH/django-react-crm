# Atelier CRM back end

This directory contains the completed Django REST Framework solution used by the lesson.

## Run locally on macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py seed
python manage.py runserver
```

## Run locally in Windows Git Bash

```bash
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py seed
python manage.py runserver
```

The seed command creates `staff` with password `staffpass123` for local classroom use.
