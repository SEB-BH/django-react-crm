import { apiFetch } from './api'

export const show = () => apiFetch('/dashboard/')
