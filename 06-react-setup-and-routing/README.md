<h1>
  <span class="headline">Atelier CRM</span>
  <span class="subhead">React Setup and Routing</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to create the React frontend, configure routing, and connect it to the Django API.

## Create the React app

Confirm that your installed Node version meets the current Vite requirement:

```bash
node --version
```

Keep the Django server running. Open a second terminal from the `atelier-crm` root:

```bash
npm create vite@latest front-end -- --template react
cd front-end
npm install
npm install react-router-dom
npm run dev
```

The application should open at `http://localhost:5173`.

## Create the frontend environment file

Create `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Only variables beginning with `VITE_` are exposed to frontend code.

Do not store private secrets in a Vite environment variable. Browser users can inspect frontend code.

## Plan the React structure

```text
src/
├── components/
│   ├── AppLayout.jsx
│   └── NavBar.jsx
├── pages/
│   ├── DashboardPage.jsx
│   ├── ContactListPage.jsx
│   ├── ContactFormPage.jsx
│   └── ContactDetailsPage.jsx
├── services/
│   ├── api.js
│   └── contacts.js
├── App.jsx
├── main.jsx
└── index.css
```

We will continue using top-level `components`, `pages`, and `services` folders rather than one directory per component.

## Create placeholder pages

Example `src/pages/DashboardPage.jsx`:

```jsx
const DashboardPage = () => {
  return <h2>Dashboard</h2>
}

export default DashboardPage
```

Create similar placeholders for the contact pages.

## Configure React Router

Update `src/main.jsx`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

Update `src/App.jsx`:

```jsx
import { Route, Routes } from 'react-router-dom'
import ContactDetailsPage from './pages/ContactDetailsPage'
import ContactFormPage from './pages/ContactFormPage'
import ContactListPage from './pages/ContactListPage'
import DashboardPage from './pages/DashboardPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/contacts" element={<ContactListPage />} />
      <Route path="/contacts/new" element={<ContactFormPage />} />
      <Route path="/contacts/:contactId" element={<ContactDetailsPage />} />
      <Route path="/contacts/:contactId/edit" element={<ContactFormPage />} />
    </Routes>
  )
}

export default App
```

## Create a shared API helper

Create `src/services/api.js`:

```javascript
const BASE_URL = import.meta.env.VITE_API_URL

export const apiFetch = async (path, options = {}) => {
  const headers = { ...options.headers }

  if (options.body) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong.')
  }

  return data
}
```

This helper will eventually add the JWT header in one place.

## CORS check

React and Django use different origins during development:

```text
React: http://localhost:5173
Django: http://127.0.0.1:8000
```

The browser permits the request only because Django's CORS settings explicitly allow React's origin.

## Check for understanding

1. Why is the API URL stored in a frontend environment variable?
2. Is `VITE_API_URL` secret?
3. Why create an `apiFetch` helper?
4. Which component provides routing context to the app?
