import { useEffect, useState } from 'react'
import { IconPlus, IconSparkles, IconDotsVertical } from '@tabler/icons-react'
import {
  fetchAuthorPosts,
  fetchAuthorStats,
  createPost,
  updatePost,
  togglePublishPost,
  deletePost,
} from '../api/blogApi'
import PostStats from './PostStats'
import PostModal from '../modals/PostModal'
import AiPostGeneratorModal from '../modals/AiPostGeneratorModal'
import { showConfirmDialog, showErrorAlert, showSuccessAlert, formatDate } from '../../../helpers/toolsHelper'

export default function AuthorDashboard({ darkMode }) {
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 })
  const [openMenuId, setOpenMenuId] = useState(null)
  const [modalPost, setModalPost] = useState(null)
  const [showAiModal, setShowAiModal] = useState(false)

  const loadData = async () => {
    try {
      const [postsRes, statsRes] = await Promise.all([fetchAuthorPosts(), fetchAuthorStats()])
      setPosts(postsRes.data)
      setStats(statsRes.data)
    } catch (err) {
      await showErrorAlert('Gagal Memuat Data', err.message)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSavePost = async (data) => {
    try {
      if (modalPost.id) {
        await updatePost(modalPost.id, data)
        await showSuccessAlert('Artikel Diperbarui')
      } else {
        await createPost(data)
        await showSuccessAlert('Artikel Dibuat')
      }
      setModalPost(null)
      loadData()
    } catch (err) {
      await showErrorAlert('Gagal Menyimpan', err.message)
    }
  }

  const handleTogglePublish = async (id) => {
    try {
      await togglePublishPost(id)
      loadData()
    } catch (err) {
      await showErrorAlert('Gagal Mengubah Status', err.message)
    }
  }

  const handleDelete = async (id) => {
    setOpenMenuId(null)
    const ok = await showConfirmDialog('Hapus Artikel?', 'Artikel yang dihapus tidak dapat dikembalikan.')
    if (!ok) return
    await deletePost(id)
      .then(async () => {
        await showSuccessAlert('Artikel Dihapus')
        loadData()
      })
      .catch((err) => showErrorAlert('Gagal Menghapus', err.message))
  }

  return (
    <main className="w-full px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Workspace Penulis</h1>
          <p className="text-sm text-slate-500">Kelola draf, publikasi, dan buat artikel dengan bantuan AI.</p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm"
          >
            <IconSparkles size={18} /> AI Generator
          </button>
          <button
            type="button"
            onClick={() => setModalPost({})}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm"
          >
            <IconPlus size={18} /> Tambah Artikel
          </button>
        </div>
      </div>

      <PostStats stats={stats} />

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-visible">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-500">
              <th className="p-4">Judul</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Status</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">
                  Belum ada artikel. Klik "Tambah Artikel" atau gunakan "AI Generator".
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="p-4 font-semibold">{p.title}</td>
                  <td className="p-4 text-sm">{p.category}</td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(p.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        p.is_published
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {p.is_published ? 'Terbit' : 'Draf'}
                    </button>
                  </td>
                  <td className="p-4 text-sm text-slate-500">{formatDate(p.created_at)}</td>
                  <td className="p-4 text-right relative">
                    <button
                      type="button"
                      aria-label="Menu aksi"
                      onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <IconDotsVertical size={18} />
                    </button>
                    {openMenuId === p.id && (
                      <div className="absolute right-4 mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-30 py-1 text-left">
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null)
                            setModalPost(p)
                          }}
                          className="w-full px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          ✏️ Ubah
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="w-full px-4 py-2 text-sm text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          🗑️ Hapus
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalPost && (
        <PostModal
          initialData={modalPost}
          darkMode={darkMode}
          onClose={() => setModalPost(null)}
          onSave={handleSavePost}
        />
      )}

      {showAiModal && (
        <AiPostGeneratorModal
          onClose={() => setShowAiModal(false)}
          onApplyDraft={(draft) => {
            setShowAiModal(false)
            setModalPost(draft)
          }}
        />
      )}
    </main>
  )
}