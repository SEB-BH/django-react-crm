const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

export const getAccessToken = () => localStorage.getItem('accessToken')

export const apiFetch = async (path, options = {}) => {
  const token = getAccessToken()
  const headers = { ...options.headers }

  if (options.body) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
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
    const message = data.detail || data.message || 'Something went wrong.'
    throw new Error(message)
  }

  return data
}
