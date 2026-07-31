<h1>
  <span class="prefix">Django REST Framework + React</span>
  <span class="headline">Atelier CRM</span>
</h1>

## About

In this code-along, students build a small customer relationship management application for a premium goods business. The application tracks contacts, possible sales, follow-up dates, and customer interactions.

Students are assumed to have completed a MERN application before beginning this module. No knowledge of Cat Collector or Django templates is required. Each Django concept is introduced by comparing it with a responsibility students have already seen in Express, Mongoose, PostgreSQL, or React.

The required MVP deliberately focuses on one useful workflow:

```text
Create a contact
      ↓
Create an opportunity for that contact
      ↓
Record customer interactions
      ↓
Move the opportunity through sales stages
      ↓
Use dashboard data to decide what needs attention
```

The completed app uses:

- Django 5.2 LTS
- Django REST Framework
- PostgreSQL
- Simple JWT
- React with Vite
- React Router
- Plain CSS

## Content

| Part | Approx. Delivery Time | Lesson | Skills |
| --- | ---: | --- | --- |
| Plan | 45 min | [Project Overview and CRM Planning](./01-project-overview/README.md) | Plan the workflow, user stories, and ERD. |
| Back end | 60 min | [Django REST Framework Setup](./02-back-end-setup/README.md) | Create the project, virtual environment, database, and settings. |
|  | 35 min | [Django API Concepts for MERN Developers](./03-django-api-concepts/README.md) | Map MERN concepts to Django and DRF. |
|  | 60 min | [Contact Model and Django Admin](./04-contact-model-and-admin/README.md) | Models, migrations, admin, and ORM. |
|  | 90 min | [Contact CRUD API](./05-contact-api/README.md) | Serializers, API views, URLs, CRUD, and Postman. |
| Front end | 60 min | [React Setup and Routing](./06-react-setup-and-routing/README.md) | Vite, React Router, service modules, and CORS. |
|  | 60 min | [Reading Contacts in React](./07-reading-contacts/README.md) | Fetch, loading state, lists, and search. |
|  | 75 min | [Creating Contacts](./08-creating-contacts/README.md) | Controlled forms and POST requests. |
|  | 90 min | [Contact Details, Edit, and Delete](./09-contact-details-edit-delete/README.md) | Complete CRUD and communication links. |
| Relationships | 120 min | [Opportunities and One-to-Many Relationships](./10-opportunities-and-relationships/README.md) | Foreign keys, choices, nested data, and related forms. |
|  | 90 min | [Building the Sales Pipeline](./11-sales-pipeline/README.md) | Group records and PATCH a sales stage. |
|  | 90 min | [Recording Interaction History](./12-interaction-history/README.md) | Nested child resources and timelines. |
| Reporting | 75 min | [Dashboard Metrics](./13-dashboard-metrics/README.md) | ORM filters, counts, sums, and dashboard cards. |
| Security | 120 min | [JWT Authentication and Protected Routes](./14-jwt-authentication/README.md) | Staff login, bearer tokens, and protected routes. |
| Finish | 60 min | [Finish, Test, and Extend the CRM](./15-finish-and-extend/README.md) | Acceptance testing, scope decisions, and next steps. |

## Included code

- [`starter-code`](./starter-code/README.md) explains the starting state students create during setup.
- [`solution-code/back-end`](./solution-code/back-end/README.md) contains the completed Django API.
- [`solution-code/front-end`](./solution-code/front-end/README.md) contains the completed React application.

The solution includes a `seed` command for instructor demonstrations and troubleshooting.

## Internal

### Prerequisites

Students should already be able to:

- Build CRUD routes in Express
- Use models and relationships in a full-stack application
- Fetch API data in React
- Build controlled forms
- Use React Router
- Explain the purpose of authentication and bearer tokens
- Use basic Python syntax and PostgreSQL commands

### Instructor resources

- [Instructor Guide](./internal-resources/instructor-guide.md)
- [Release Notes](./internal-resources/release-notes.md)
- [References](./references/README.md)
