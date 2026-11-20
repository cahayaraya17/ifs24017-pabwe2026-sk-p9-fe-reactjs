import { apiRequest } from '../../../helpers/apiHelper'

export const fetchCategories = () => apiRequest('/api/public/categories')

export const fetchPublicPosts = (q = '', category = '') => {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (category && category !== 'Semua') params.set('category', category)
  const qs = params.toString()
  return apiRequest(`/api/public/posts${qs ? `?${qs}` : ''}`)
}

export const fetchPublicPostBySlug = (slug) => apiRequest(`/api/public/posts/${slug}`)

export const fetchAuthorPosts = () => apiRequest('/api/posts')
export const fetchAuthorStats = () => apiRequest('/api/posts/stats')
export const createPost = (data) => apiRequest('/api/posts', { method: 'POST', body: JSON.stringify(data) })
export const updatePost = (id, data) => apiRequest(`/api/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const togglePublishPost = (id) => apiRequest(`/api/posts/${id}/toggle-publish`, { method: 'PATCH' })
export const deletePost = (id) => apiRequest(`/api/posts/${id}`, { method: 'DELETE' })
export const generateAiBlog = (data) => apiRequest('/api/posts/ai-generate', { method: 'POST', body: JSON.stringify(data) })