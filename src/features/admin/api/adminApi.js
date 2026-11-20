import { apiRequest } from '../../../helpers/apiHelper'

const normalizeList = async (promise) => {
  const res = await promise
  return { ...res, data: res.data || [] }
}

export const fetchAdminUsers = () => normalizeList(apiRequest('/api/admin/users'))
export const fetchAdminPosts = () => normalizeList(apiRequest('/api/admin/posts'))
