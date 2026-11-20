const TOKEN_KEY = 'delcom_blog_token'
const USER_KEY = 'delcom_blog_user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setAuthSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function apiRequest(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const response = await fetch(path, { ...options, headers })
  const payload = await response.json()

  if (!response.ok || payload.status !== 'success') {
    throw new Error(payload.message || 'Terjadi kesalahan pada server')
  }

  return payload
}