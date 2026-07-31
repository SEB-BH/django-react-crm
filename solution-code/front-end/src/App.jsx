import { useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import ContactDetailsPage from './pages/ContactDetailsPage'
import ContactFormPage from './pages/ContactFormPage'
import ContactListPage from './pages/ContactListPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import OpportunityDetailsPage from './pages/OpportunityDetailsPage'
import OpportunityFormPage from './pages/OpportunityFormPage'
import OpportunityListPage from './pages/OpportunityListPage'
import * as authService from './services/auth'

const App = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState(localStorage.getItem('username'))
  const isLoggedIn = Boolean(localStorage.getItem('accessToken'))

  const handleLogin = async (credentials) => {
    const loggedInUsername = await authService.login(credentials)
    setUsername(loggedInUsername)
    navigate('/')
  }

  const handleLogout = () => {
    authService.logout()
    setUsername(null)
    navigate('/login')
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage isLoggedIn={isLoggedIn} handleLogin={handleLogin} />}
      />

      <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
        <Route element={<AppLayout username={username} handleLogout={handleLogout} />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/contacts" element={<ContactListPage />} />
          <Route path="/contacts/new" element={<ContactFormPage />} />
          <Route path="/contacts/:contactId" element={<ContactDetailsPage />} />
          <Route path="/contacts/:contactId/edit" element={<ContactFormPage />} />
          <Route path="/opportunities" element={<OpportunityListPage />} />
          <Route path="/opportunities/new" element={<OpportunityFormPage />} />
          <Route path="/opportunities/:opportunityId" element={<OpportunityDetailsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
