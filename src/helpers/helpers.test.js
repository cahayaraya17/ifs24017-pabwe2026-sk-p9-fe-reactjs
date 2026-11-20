import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getToken,
  setAuthSession,
  clearAuthSession,
  getStoredUser,
  apiRequest,
} from './apiHelper'
import {
  formatDate,
  showSuccessAlert,
  showErrorAlert,
  showConfirmDialog,
} from './toolsHelper'
import Swal from 'sweetalert2'

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}))

describe('apiHelper & toolsHelper', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('manages auth session in localStorage', () => {
    expect(getToken()).toBe('')
    expect(getStoredUser()).toBeNull()

    setAuthSession('tok123', { id: 1, username: 'admin' })
    expect(getToken()).toBe('tok123')
    expect(getStoredUser()).toEqual({ id: 1, username: 'admin' })

    localStorage.setItem('delcom_blog_user', '{invalid-json')
    expect(getStoredUser()).toBeNull()

    clearAuthSession()
    expect(getToken()).toBe('')
  })

  it('handles apiRequest success and errors', async () => {
    setAuthSession('tok123', { id: 1 })
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'success', data: { ok: true } }),
    })

    const res = await apiRequest('/api/test')
    expect(res.data.ok).toBe(true)

    clearAuthSession()
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ status: 'fail', message: 'Unauthorized' }),
    })
    await expect(apiRequest('/api/fail')).rejects.toThrow('Unauthorized')

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ status: 'error' }),
    })
    await expect(apiRequest('/api/err')).rejects.toThrow('Terjadi kesalahan pada server')
  })

  it('formats dates and triggers SweetAlert dialogs', async () => {
    expect(formatDate('')).toBe('-')
    expect(formatDate('2026-11-19T00:00:00Z')).toContain('2026')

    Swal.fire.mockResolvedValue({ isConfirmed: true })
    await showSuccessAlert('Sukses', 'Detail')
    await showErrorAlert('Gagal', 'Detail')
    const confirmed = await showConfirmDialog('Yakin?', 'Hapus')
    expect(confirmed).toBe(true)
  })
})