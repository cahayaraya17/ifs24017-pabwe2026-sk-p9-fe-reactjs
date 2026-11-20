import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loginUser, registerUser, logoutUser } from './auth/api/authApi'
import {
  fetchCategories,
  fetchPublicPosts,
  fetchPublicPostBySlug,
  fetchAuthorPosts,
  fetchAuthorStats,
  createPost,
  updatePost,
  togglePublishPost,
  deletePost,
  generateAiBlog,
} from './blog/api/blogApi'
import { fetchAdminUsers, fetchAdminPosts } from './admin/api/adminApi'

describe('Feature API modules', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success', data: [] }),
    })
  })

  it('calls authApi endpoints', async () => {
    await loginUser('u', 'p')
    await registerUser('u', 'e@e.com', 'p')
    await logoutUser()
    expect(global.fetch).toHaveBeenCalledTimes(3)
  })

  it('calls blogApi endpoints', async () => {
    await fetchCategories()
    await fetchPublicPosts('go', 'Teknologi')
    await fetchPublicPosts('', 'Semua')
    await fetchPublicPostBySlug('slug-1')
    await fetchAuthorPosts()
    await fetchAuthorStats()
    await createPost({ title: 'T' })
    await updatePost(1, { title: 'T' })
    await togglePublishPost(1)
    await deletePost(1)
    await generateAiBlog({ topic: 'AI' })
    expect(global.fetch).toHaveBeenCalledTimes(11)
  })

  it('calls adminApi endpoints', async () => {
    await fetchAdminUsers()
    await fetchAdminPosts()
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })
})