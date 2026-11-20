import { describe, it, expect, vi } from 'vitest'
import * as apiHelper from '../../../helpers/apiHelper'
import { fetchAdminUsers, fetchAdminPosts } from './adminApi'

describe('adminApi null fallback', () => {
  it('returns empty array when data is null', async () => {
    vi.spyOn(apiHelper, 'apiRequest').mockResolvedValue({ status: 'success', data: null })
    const users = await fetchAdminUsers()
    const posts = await fetchAdminPosts()
    expect(users.data).toEqual([])
    expect(posts.data).toEqual([])
    vi.restoreAllMocks()
  })
})
