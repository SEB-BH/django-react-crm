const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

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

export const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('username')
}
