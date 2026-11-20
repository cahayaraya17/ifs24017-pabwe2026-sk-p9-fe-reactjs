import { apiRequest } from '../../../helpers/apiHelper'

export const loginUser = (username, password) =>
  apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })

export const registerUser = (username, email, password) =>
  apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  })

export const logoutUser = () =>
  apiRequest('/api/auth/logout', { method: 'POST' })