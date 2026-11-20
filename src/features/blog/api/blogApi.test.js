import { describe, it, expect, vi } from 'vitest'
import * as apiHelper from '../../../helpers/apiHelper'
import { fetchCategories, fetchPublicPosts, fetchAuthorPosts } from './blogApi'

describe('blogApi null fallback', () => {
  it('returns empty array when data is null', async () => {
    vi.spyOn(apiHelper, 'apiRequest').mockResolvedValue({ status: 'success', data: null })
    const cats = await fetchCategories()
    const pub = await fetchPublicPosts()
    const auth = await fetchAuthorPosts()
    expect(cats.data).toEqual([])
    expect(pub.data).toEqual([])
    expect(auth.data).toEqual([])
    vi.restoreAllMocks()
  })
})
