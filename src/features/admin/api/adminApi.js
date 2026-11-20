import { apiRequest } from '../../../helpers/apiHelper'

export const fetchAdminUsers = () => apiRequest('/api/admin/users')
export const fetchAdminPosts = () => apiRequest('/api/admin/posts')