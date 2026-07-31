import { useState } from 'react'
import { Navigate } from 'react-router-dom'

const LoginPage = ({ isLoggedIn, handleLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  if (isLoggedIn) {
    return <Navigate to="/" replace />
  }

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setError('')
      await handleLogin(formData)
    } catch (loginError) {
      setError(loginError.message)
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Staff access</p>
        <h1>Atelier CRM</h1>
        <p>Log in with the staff account created in Django admin.</p>

        <label>
          Username
          <input name="username" value={formData.username} onChange={handleChange} required />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}
        <button type="submit">Log in</button>
      </form>
    </main>
  )
}

export default LoginPage
