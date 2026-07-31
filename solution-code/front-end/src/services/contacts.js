import { apiFetch } from './api'

export const index = () => apiFetch('/contacts/')

export const show = (contactId) => apiFetch(`/contacts/${contactId}/`)

export const create = (formData) => apiFetch('/contacts/', {
  method: 'POST',
  body: JSON.stringify(formData),
})

export const update = (contactId, formData) => apiFetch(`/contacts/${contactId}/`, {
  method: 'PUT',
  body: JSON.stringify(formData),
})

export const deleteContact = (contactId) => apiFetch(`/contacts/${contactId}/`, {
  method: 'DELETE',
})
