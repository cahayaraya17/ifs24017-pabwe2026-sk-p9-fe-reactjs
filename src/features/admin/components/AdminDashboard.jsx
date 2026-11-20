import { useEffect, useState } from 'react'
import { fetchAdminUsers, fetchAdminPosts } from '../api/adminApi'
import { showErrorAlert } from '../../../helpers/toolsHelper'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])

  useEffect(() => {
    Promise.all([fetchAdminUsers(), fetchAdminPosts()])
      .then(([uRes, pRes]) => {
        setUsers(uRes.data)
        setPosts(pRes.data)
      })
      .catch((err) => showErrorAlert('Gagal Memuat Panel Admin', err.message))
  }, [])

  return (
    <main className="w-full px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Panel Administrasi Sistem</h1>
        <p className="text-sm text-slate-500">Pemantauan seluruh penulis dan arsip publikasi blog.</p>
      </div>

      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold">
          Direktori Pengguna ({users.length})
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-500">
              <th className="p-4">ID</th>
              <th className="p-4">Username</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Total Artikel</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800 text-sm">
                <td className="p-4">{u.id}</td>
                <td className="p-4 font-semibold">{u.username}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">{u.role}</td>
                <td className="p-4">{u.total_posts} ({u.published_posts} terbit)</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold">
          Seluruh Artikel Sistem ({posts.length})
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-500">
              <th className="p-4">Judul</th>
              <th className="p-4">Penulis</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800 text-sm">
                <td className="p-4 font-semibold">{p.title}</td>
                <td className="p-4">{p.author?.username || '-'}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">{p.is_published ? 'Terbit' : 'Draf'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}