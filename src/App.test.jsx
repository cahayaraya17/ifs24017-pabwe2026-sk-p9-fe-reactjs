import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'
import { setAuthSession, clearAuthSession } from './helpers/apiHelper'
import PublicArticleDetail from './features/blog/components/PublicArticleDetail'
import AdminDashboard from './features/admin/components/AdminDashboard'

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
  },
}))

vi.mock('@toast-ui/editor', () => ({
  default: vi.fn().mockImplementation(function (opts) {
    return {
      getMarkdown: () => 'Konten markdown',
      setMarkdown: vi.fn(),
      destroy: vi.fn(),
      _trigger: opts.events?.change,
    }
  }),
}))

vi.mock('@toast-ui/editor/dist/toastui-editor-viewer', () => ({
  default: vi.fn().mockImplementation(function () {
    return { destroy: vi.fn() }
  }),
}))

const samplePosts = [
  {
    id: 1,
    title: 'Artikel Pertama',
    slug: 'artikel-pertama',
    category: 'Teknologi',
    excerpt: 'Ringkasan',
    content: 'Isi lengkap artikel',
    is_published: true,
    reading_time_minutes: 2,
    created_at: '2026-11-19T00:00:00Z',
    author: { username: 'member' },
  },
  {
    id: 2,
    title: 'Artikel Draf',
    slug: 'artikel-draf',
    category: 'Bisnis',
    excerpt: '',
    content: 'Isi draf',
    is_published: false,
    reading_time_minutes: 0,
    created_at: '',
    author: null,
  },
]

describe('App Multi-Tier SPA 100% Coverage', () => {
  beforeEach(() => {
    clearAuthSession()
    window.history.pushState({}, '', '/')
    global.fetch = vi.fn(async (url, opts) => {
      if (url.includes('/api/public/categories')) {
        return { ok: true, json: async () => ({ status: 'success', data: ['Teknologi', 'Bisnis'] }) }
      }
      if (url.includes('/api/public/posts/artikel-pertama')) {
        return { ok: true, json: async () => ({ status: 'success', data: samplePosts[0] }) }
      }
      if (url.includes('/api/public/posts/artikel-draf')) {
        return { ok: true, json: async () => ({ status: 'success', data: samplePosts[1] }) }
      }
      if (url.includes('/api/public/posts/not-found')) {
        return { ok: false, json: async () => ({ status: 'fail', message: 'Article not found' }) }
      }
      if (url.includes('/api/public/posts')) {
        return { ok: true, json: async () => ({ status: 'success', data: samplePosts }) }
      }
      if (url.includes('/api/auth/login')) {
        const body = JSON.parse(opts.body)
        if (body.username === 'bad') {
          return { ok: false, json: async () => ({ status: 'fail', message: 'Invalid login' }) }
        }
        return {
          ok: true,
          json: async () => ({
            status: 'success',
            data: {
              token: 'jwt-tok',
              user: { id: 1, username: body.username, role: body.username === 'admin' ? 'admin' : 'member' },
            },
          }),
        }
      }
      if (url.includes('/api/auth/register')) {
        const body = JSON.parse(opts.body)
        if (body.username === 'dup') {
          return { ok: false, json: async () => ({ status: 'fail', message: 'Duplicate user' }) }
        }
        return { ok: true, json: async () => ({ status: 'success', data: {} }) }
      }
      if (url.includes('/api/posts/stats')) {
        return { ok: true, json: async () => ({ status: 'success', data: { total: 2, published: 1, draft: 1 } }) }
      }
      if (url.includes('/api/posts/ai-generate')) {
        const body = JSON.parse(opts.body)
        if (body.topic === 'ERR') {
          return { ok: false, json: async () => ({ status: 'error', message: 'AI Error' }) }
        }
        return {
          ok: true,
          json: async () => ({
            status: 'success',
            data: {
              title: 'Judul AI',
              category: 'Teknologi',
              excerpt: 'Excerpt AI',
              content: 'Konten AI',
              search_sources: body.include_web_search
                ? [{ title: 'Sumber 1', url: 'https://delcom.org', snippet: 'Snippet' }]
                : [],
            },
          }),
        }
      }
      if (url.includes('/api/admin/users')) {
        return {
          ok: true,
          json: async () => ({
            status: 'success',
            data: [{ id: 1, username: 'admin', email: 'a@delcom.org', role: 'admin', total_posts: 2, published_posts: 1 }],
          }),
        }
      }
      if (url.includes('/api/admin/posts')) {
        return { ok: true, json: async () => ({ status: 'success', data: samplePosts }) }
      }
      if (url.includes('/api/posts')) {
        return { ok: true, json: async () => ({ status: 'success', data: samplePosts }) }
      }
      return { ok: true, json: async () => ({ status: 'success', data: null }) }
    })
  })

  it('covers public gallery, search, detail fallbacks, and error branches', async () => {
    const { unmount } = render(<App />)
    await waitFor(() => expect(screen.getByText('Artikel Pertama')).toBeInTheDocument())

    fireEvent.click(screen.getByText('Delcom Blog'))
    fireEvent.click(screen.getByRole('button', { name: 'Teknologi' }))
    fireEvent.change(screen.getByPlaceholderText('Cari judul atau topik...'), { target: { value: 'Artikel' } })
    fireEvent.click(screen.getByLabelText('Toggle theme'))

    await waitFor(() => expect(screen.getByText('Artikel Pertama')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Artikel Pertama'))
    await waitFor(() => expect(screen.getByText('Kembali ke Daftar Artikel')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Kembali ke Daftar Artikel'))
    unmount()

    const nav = vi.fn()
    const { unmount: uDetail } = render(<PublicArticleDetail slug="artikel-draf" darkMode={false} onNavigate={nav} />)
    await waitFor(() => expect(screen.getByText('Artikel Draf')).toBeInTheDocument())
    expect(screen.getByText(/1 menit baca/)).toBeInTheDocument()
    uDetail()

    window.history.pushState({}, '', '/posts/not-found')
    const { unmount: u404 } = render(<App />)
    await waitFor(() => expect(screen.getByText('Article not found')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Kembali ke Beranda'))
    u404()

    global.fetch = vi.fn().mockRejectedValue(new Error('Network down'))
    const { unmount: uEmpty } = render(<App />)
    await waitFor(() => expect(screen.getByText('Belum ada artikel yang dipublikasikan.')).toBeInTheDocument())
    uEmpty()
  })

  it('covers register fail/success, login fail/success, author CRUD, modals, and errors', async () => {
    render(<App />)
    fireEvent.click(screen.getByText('Register'))

    fireEvent.click(await screen.findByText('Sudah punya akun? Login'))
    expect(screen.getByText('Masuk ke Delcom Blog')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Belum punya akun? Daftar'))
    expect(screen.getByText('Daftar Akun Penulis')).toBeInTheDocument()

    // Register fail branch (AuthPage line 29)
    fireEvent.change(document.getElementById('login-username'), { target: { value: 'dup' } })
    fireEvent.change(document.getElementById('register-email'), { target: { value: 'p@delcom.org' } })
    fireEvent.change(document.getElementById('login-password'), { target: { value: '123456' } })
    fireEvent.click(document.getElementById('login-submit'))
    await waitFor(() => expect(document.getElementById('login-submit')).not.toBeDisabled())

    // Register success
    fireEvent.change(document.getElementById('login-username'), { target: { value: 'penulis' } })
    fireEvent.click(document.getElementById('login-submit'))
    await waitFor(() => expect(screen.getByText('Masuk ke Delcom Blog')).toBeInTheDocument())

    // Login fail
    fireEvent.change(document.getElementById('login-username'), { target: { value: 'bad' } })
    fireEvent.change(document.getElementById('login-password'), { target: { value: 'wrong' } })
    fireEvent.click(document.getElementById('login-submit'))
    await waitFor(() => expect(document.getElementById('login-submit')).not.toBeDisabled())

    // Login success
    fireEvent.change(document.getElementById('login-username'), { target: { value: 'member' } })
    fireEvent.change(document.getElementById('login-password'), { target: { value: 'member' } })
    fireEvent.click(document.getElementById('login-submit'))

    await waitFor(() => expect(screen.getByText('Workspace Penulis')).toBeInTheDocument())
    await waitFor(() => expect(screen.getByText('Artikel Pertama')).toBeInTheDocument())

    fireEvent.click(screen.getByText('Terbit'))
    const menus = screen.getAllByLabelText('Menu aksi')
    fireEvent.click(menus[0])
    fireEvent.click(menus[0])
    fireEvent.click(menus[0])
    fireEvent.click(screen.getByText('✏️ Ubah'))
    fireEvent.change(screen.getByDisplayValue('Teknologi'), { target: { value: 'Pendidikan' } })
    fireEvent.change(screen.getByPlaceholderText('Ringkasan singkat artikel...'), { target: { value: 'Ringkasan baru' } })
    fireEvent.click(screen.getByText('Simpan Artikel'))

    await waitFor(() => expect(screen.getAllByLabelText('Menu aksi').length).toBeGreaterThan(0))
    fireEvent.click(screen.getAllByLabelText('Menu aksi')[0])
    fireEvent.click(screen.getByText('🗑️ Hapus'))

    // Create new article modal & close button (✕)
    fireEvent.click(screen.getByText('Tambah Artikel'))
    fireEvent.click(screen.getAllByText('✕')[0])

    fireEvent.click(screen.getByText('Tambah Artikel'))
    fireEvent.change(screen.getByPlaceholderText('Judul artikel menarik...'), { target: { value: 'Baru' } })
    fireEvent.click(screen.getByText('Langsung Publikasikan Artikel'))
    fireEvent.click(screen.getByText('Simpan Artikel'))

    // AI Generator modal: close, error, success, apply
    fireEvent.click(screen.getByText('AI Generator'))
    fireEvent.click(screen.getAllByText('✕')[0])

    fireEvent.click(screen.getByText('AI Generator'))
    fireEvent.change(screen.getByDisplayValue('Teknologi'), { target: { value: 'Bisnis' } })
    fireEvent.click(screen.getByText('Sertakan Penelusuran Mesin Pencari (Search Engine)'))
    fireEvent.change(screen.getByPlaceholderText('Contoh: Perkembangan Golang 1.27 untuk Microservices'), {
      target: { value: 'ERR' },
    })
    fireEvent.click(screen.getByText('Generate Artikel AI'))
    await waitFor(() => expect(screen.getByText('Generate Artikel AI')).not.toBeDisabled())

    fireEvent.change(screen.getByPlaceholderText('Contoh: Perkembangan Golang 1.27 untuk Microservices'), {
      target: { value: 'Golang AI' },
    })
    fireEvent.click(screen.getByText('Sertakan Penelusuran Mesin Pencari (Search Engine)'))
    fireEvent.click(screen.getByText('Generate Artikel AI'))
    await waitFor(() => expect(screen.getByText('Judul AI')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Terapkan ke Editor'))
    fireEvent.click(screen.getByText('Batal'))

    // Logout
    fireEvent.click(screen.getByText('Logout'))
    await waitFor(() => expect(screen.getByText('Eksplorasi Artikel Publik')).toBeInTheDocument())
  })

  it('covers author error branches, empty state, and admin dashboard', async () => {
    // Author route while logged out -> login directly from /author (App.jsx line 60)
    window.history.pushState({}, '', '/author')
    const { unmount: uAuth } = render(<App />)
    await screen.findByText('Masuk ke Delcom Blog')
    fireEvent.change(document.getElementById('login-username'), { target: { value: 'member' } })
    fireEvent.change(document.getElementById('login-password'), { target: { value: 'member' } })
    fireEvent.click(document.getElementById('login-submit'))
    await waitFor(() => expect(screen.getByText('Workspace Penulis')).toBeInTheDocument())
    uAuth()

    // Author error branches (load, save, toggle, delete cancel & error)
    setAuthSession('mem-tok', { id: 2, username: 'member', role: 'member' })
    global.fetch = vi.fn().mockRejectedValue(new Error('Server error'))
    window.history.pushState({}, '', '/author')
    const { unmount: uErr } = render(<App />)
    await waitFor(() => expect(screen.getByText(/Belum ada artikel\./)).toBeInTheDocument())

    fireEvent.click(screen.getByText('Tambah Artikel'))
    fireEvent.change(screen.getByPlaceholderText('Judul artikel menarik...'), { target: { value: 'Fail' } })
    fireEvent.click(screen.getByText('Simpan Artikel'))
    await waitFor(() => expect(screen.getByText('Simpan Artikel')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Batal'))
    uErr()

    const Swal = (await import('sweetalert2')).default
    global.fetch = vi.fn(async (url) => {
      if (url.includes('/api/posts/stats')) {
        return { ok: true, json: async () => ({ status: 'success', data: { total: 1, published: 0, draft: 1 } }) }
      }
      if (url === '/api/posts') {
        return { ok: true, json: async () => ({ status: 'success', data: [samplePosts[1]] }) }
      }
      return { ok: false, json: async () => ({ status: 'fail', message: 'Action failed' }) }
    })
    window.history.pushState({}, '', '/author')
    const { unmount: uActErr } = render(<App />)
    await waitFor(() => expect(screen.getByText('Draf')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Draf'))

    Swal.fire.mockResolvedValueOnce({ isConfirmed: false })
    fireEvent.click(screen.getByLabelText('Menu aksi'))
    fireEvent.click(screen.getByText('🗑️ Hapus'))

    Swal.fire.mockResolvedValueOnce({ isConfirmed: true })
    fireEvent.click(screen.getByLabelText('Menu aksi'))
    fireEvent.click(screen.getByText('🗑️ Hapus'))
    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'error', title: 'Gagal Menghapus' })))
    uActErr()

    // Admin login & AdminDashboard
    clearAuthSession()
    global.fetch = vi.fn(async (url, opts) => {
      if (url.includes('/api/auth/login')) {
        return {
          ok: true,
          json: async () => ({
            status: 'success',
            data: { token: 'admin-tok', user: { id: 1, username: 'admin', role: 'admin' } },
          }),
        }
      }
      if (url.includes('/api/admin/users')) {
        return {
          ok: true,
          json: async () => ({
            status: 'success',
            data: [{ id: 1, username: 'admin', email: 'a@delcom.org', role: 'admin', total_posts: 2, published_posts: 1 }],
          }),
        }
      }
      return { ok: true, json: async () => ({ status: 'success', data: samplePosts }) }
    })

    window.history.pushState({}, '', '/login')
    const { unmount: uAdmin } = render(<App />)
    fireEvent.change(document.getElementById('login-username'), { target: { value: 'admin' } })
    fireEvent.change(document.getElementById('login-password'), { target: { value: 'admin' } })
    fireEvent.click(document.getElementById('login-submit'))

    await waitFor(() => expect(screen.getByText('Panel Administrasi Sistem')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Workspace'))
    await waitFor(() => expect(screen.getByText('Workspace Penulis')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Admin'))
    await waitFor(() => expect(screen.getByText('Panel Administrasi Sistem')).toBeInTheDocument())
    uAdmin()

    global.fetch = vi.fn().mockRejectedValue(new Error('Admin fetch error'))
    const { unmount: uAdminErr } = render(<AdminDashboard />)
    await waitFor(() => expect(screen.getByText('Direktori Pengguna (0)')).toBeInTheDocument())
    uAdminErr()
    // 1. Cover StickyNavbar Login button (line 59) & AuthPage back button (line 98)
    clearAuthSession()
    window.history.pushState({}, '', '/')
    const { unmount: uNav } = render(<App />)
    await waitFor(() => expect(screen.getByText('Login')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Login'))
    expect(screen.getByText('Masuk ke Delcom Blog')).toBeInTheDocument()
    fireEvent.click(screen.getByText('← Beranda Publik'))
    expect(screen.getByText('Eksplorasi Artikel Publik')).toBeInTheDocument()

    // 2. Cover App.jsx line 63 (non-admin accessing /admin)
    setAuthSession('mem-tok', { id: 2, username: 'member', role: 'member' })
    window.history.pushState({}, '', '/admin')
    fireEvent(window, new PopStateEvent('popstate'))
    await waitFor(() => expect(screen.getByText('Eksplorasi Artikel Publik')).toBeInTheDocument())
    uNav()

    // 3. Cover AuthorDashboard line 71 & 189 (save error on edit & missing author fallback)
    setAuthSession('mem-tok', { id: 2, username: 'member', role: 'member' })
    let failSave = false
    global.fetch = vi.fn(async (url, opts) => {
      if (url.includes('/api/posts/stats')) {
        return { ok: true, json: async () => ({ status: 'success', data: { total: 1, published: 1, draft: 0 } }) }
      }
      if (url === '/api/posts' && (!opts || opts.method !== 'POST')) {
        return { ok: true, json: async () => ({ status: 'success', data: [samplePosts[0]] }) }
      }
      if (failSave) {
        return { ok: false, json: async () => ({ status: 'fail', message: 'Update failed' }) }
      }
      return { ok: true, json: async () => ({ status: 'success', data: {} }) }
    })

    window.history.pushState({}, '', '/author')
    const { unmount: uEditErr } = render(<App />)
    await waitFor(() => expect(screen.getByText('Artikel Pertama')).toBeInTheDocument())
    failSave = true
    fireEvent.click(screen.getByLabelText('Menu aksi'))
    fireEvent.click(screen.getByText('✏️ Ubah'))
    fireEvent.click(screen.getByText('Simpan Artikel'))
    await waitFor(() => expect(screen.getByText('Simpan Artikel')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Batal'))
    // Close AI Modal via onClose (baris 189)
    fireEvent.click(screen.getByText('AI Generator'))
    fireEvent.click(screen.getByText('Batal'))
    uEditErr()
  })
})