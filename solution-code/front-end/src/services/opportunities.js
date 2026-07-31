import { apiFetch } from './api'

export const index = () => apiFetch('/opportunities/')

export const show = (opportunityId) => apiFetch(`/opportunities/${opportunityId}/`)

export const create = (formData) => apiFetch('/opportunities/', {
  method: 'POST',
  body: JSON.stringify(formData),
})

export const update = (opportunityId, formData) => apiFetch(
  `/opportunities/${opportunityId}/`,
  {
    method: 'PUT',
    body: JSON.stringify(formData),
  },
)

export const updateStage = (opportunityId, stage) => apiFetch(
  `/opportunities/${opportunityId}/`,
  {
    method: 'PATCH',
    body: JSON.stringify({ stage }),
  },
)

export const createInteraction = (opportunityId, formData) => apiFetch(
  `/opportunities/${opportunityId}/interactions/`,
  {
    method: 'POST',
    body: JSON.stringify(formData),
  },
)
