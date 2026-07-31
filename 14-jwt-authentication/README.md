<h1>
  <span class="headline">Atelier CRM</span>
  <span class="subhead">JWT Authentication and Protected Routes</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to protect the API and React routes with staff-only JWT authentication.

## CRM accounts are staff accounts

This application should not offer public sign-up. A manager creates staff users through Django admin.

The frontend needs only:

- Login
- Logout
- Protected routes
- Authenticated API requests

## Configure Simple JWT

Update `config/settings.py`:

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}
```

This replaces the temporary `AllowAny` setting.

Add token URLs to `config/urls.py`:

```python
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
    path('api/', include('crm.urls')),
]
```

## Test login in Postman

```text
POST http://127.0.0.1:8000/api/token/
```

```json
{
  "username": "your-admin-username",
  "password": "your-password"
}
```

The response includes an access token and refresh token.

For a protected request, open Authorization:

```text
Type: Bearer Token
Token: <access token>
```

Or add the header manually:

```text
Authorization: Bearer <access token>
```

## Associate staff with records

Add optional ownership fields to the models:

```python
from django.contrib.auth.models import User

assigned_to = models.ForeignKey(
    User,
    on_delete=models.SET_NULL,
    related_name='opportunities',
    null=True,
    blank=True,
)
```

```python
created_by = models.ForeignKey(
    User,
    on_delete=models.SET_NULL,
    related_name='interactions',
    null=True,
    blank=True,
)
```

Migrate.

When creating an opportunity:

```python
opportunity = serializer.save(assigned_to=request.user)
```

When creating an interaction:

```python
interaction = serializer.save(
    opportunity=opportunity,
    created_by=request.user,
)
```

Authentication proves which staff user made the request.

## Add tokens to the React API helper

```javascript
export const getAccessToken = () => (
  localStorage.getItem('accessToken')
)
```

Inside `apiFetch`:

```javascript
const token = getAccessToken()

if (token) {
  headers.Authorization = `Bearer ${token}`
}
```

Every service now uses the token without repeating authorization code.

## Create the auth service

```javascript
const BASE_URL = import.meta.env.VITE_API_URL

export const login = async (credentials) => {
  const response = await fetch(`${BASE_URL}/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Unable to log in.')
  }

  localStorage.setItem('accessToken', data.access)
  localStorage.setItem('refreshToken', data.refresh)
  localStorage.setItem('username', credentials.username)

  return credentials.username
}
```

Logout clears browser storage:

```javascript
export const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('username')
}
```

## Protect React routes

Create `ProtectedRoute.jsx`:

```jsx
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({ isLoggedIn }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
```

Wrap protected routes:

```jsx
<Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
  <Route path="/" element={<DashboardPage />} />
  <Route path="/contacts" element={<ContactListPage />} />
  <Route path="/opportunities" element={<OpportunityListPage />} />
</Route>
```

## Frontend protection is not backend security

A user can bypass React and send an HTTP request directly. The Django permission setting is the real data protection. Protected React routes improve navigation and user experience.

## A note on localStorage

localStorage keeps this classroom implementation understandable. A production application needs a fuller security review, including token lifetime, refresh behavior, logout invalidation, XSS protection, HTTPS, and possibly a cookie-based strategy.

Do not describe localStorage as automatically secure because it is easy to use.

## Check for understanding

1. Which layer truly protects CRM data?
2. Why should the app not have public sign-up?
3. What does the bearer header prove?
4. Why centralize the token in `apiFetch`?
5. What should happen when the access token expires?
