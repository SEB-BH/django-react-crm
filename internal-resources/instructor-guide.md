# Instructor Guide

## Teaching goal

This module is not intended to reproduce the uploaded production CRM. It uses that application's recognizable workflow while removing infrastructure that would obscure the learning objectives.

By the end, students should understand how a React SPA communicates with a Django REST Framework API and how a relational data model supports a real business workflow.

## Recommended pacing

### Day 1: Plan and build the first API resource

- Project overview and ERD
- Back-end setup
- Django/DRF concepts
- Contact model and admin
- Begin contact API

**Checkpoint:** Students can create and read contacts in Postman.

### Day 2: Complete contact CRUD in React

- Finish contact API
- React setup and routing
- Read contacts
- Create contacts
- Begin details/edit/delete

**Checkpoint:** Students can complete contact CRUD from React.

### Day 3: Add the sales workflow

- Opportunities and foreign keys
- Opportunity form
- Pipeline grouping
- PATCH stage changes

**Checkpoint:** Students can create an opportunity for a contact and move it through stages.

### Day 4: Add history and reporting

- Interaction model and endpoint
- Interaction timeline
- Dashboard aggregation

**Checkpoint:** Students can record customer contact and see data-driven metrics.

### Day 5: Secure and test

- JWT authentication
- Protected API and React routes
- Acceptance testing
- Extension planning

**Checkpoint:** Unauthenticated users cannot access CRM data.

## Scope guardrails

Keep the following out of the required code-along:

- Public sign-up
- Multiple organizations or tenants
- Drag-and-drop pipeline ordering
- Dynamic custom fields
- Inventory synchronization
- Invoices or payments
- Direct WhatsApp or Instagram message ingestion
- File uploads
- Celery, Redis, or background jobs
- Granular employee roles

These can become project extensions after students can explain and modify the MVP.

## Why one Django app?

The completed product has three models but uses one Django app named `crm`. Multiple Django apps are useful when domains are truly independent. During a first Django REST project, one app reduces folder switching and makes the request path easier to follow.

## Why function-based API views?

DRF viewsets can remove repeated code, but they also hide the connection between an HTTP method and the logic handling it. Function-based views make the transition from Express controllers explicit. Viewsets can be introduced as a refactor after the MVP.

## Important teaching sequence

1. Build the API without authentication.
2. Test each route in Postman.
3. Connect React.
4. Add JWT last.

Before the authentication microlesson, use `AllowAny` and do not save `request.user` into models. The final solution is already secured, so instructors comparing against it should remember that difference.

## Common student errors

### Virtual environment is not active

Symptoms include `No module named django` or packages installing globally. Ask students to confirm that `(.venv)` appears in the terminal prompt.

### Wrong terminal directory

Django commands must run beside `manage.py`. React commands must run beside the frontend `package.json`.

### Missing trailing slash

The lesson consistently uses endpoints such as `/api/contacts/`. A missing slash can cause redirect or CORS confusion during POST requests.

### Model changed but database did not

Run both:

```bash
python manage.py makemigrations
python manage.py migrate
```

### React sends a contact object instead of an ID

The Opportunity serializer writes `contact: 4` but reads a nested `contact_details` object. Reinforce the difference between write data and display data.

### Empty date is rejected

Convert an empty string to `null` before sending `next_follow_up`.

### PATCH route still expects all fields

Pass `partial=True` to the serializer for PATCH requests.

### React receives 401 after JWT is added

Check localStorage, the `Authorization: Bearer ...` header, and whether the access token expired.

## Demonstration account

The solution's seed command creates:

```text
username: staff
password: staffpass123
```

Use this only for local classroom demonstrations.

## Suggested checks for understanding

- Why do we need a serializer if we already have a model?
- Why is Contact-to-Opportunity one-to-many?
- What should happen to opportunities if a contact is deleted?
- Why is PATCH appropriate for a stage change?
- Why should a CRM not offer public registration?
- What information belongs in an interaction record rather than a contact note?
- Why is a WhatsApp link different from a WhatsApp API integration?
