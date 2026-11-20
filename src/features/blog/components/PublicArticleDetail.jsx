import { useEffect, useState } from 'react'
import { IconArrowLeft, IconClock, IconUser } from '@tabler/icons-react'
import { fetchPublicPostBySlug } from '../api/blogApi'
import MarkdownViewer from '../../../components/MarkdownViewer'
import { formatDate } from '../../../helpers/toolsHelper'

export default function PublicArticleDetail({ slug, darkMode, onNavigate }) {
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPublicPostBySlug(slug)
      .then((res) => setPost(res.data))
      .catch((err) => setError(err.message))
  }, [slug])

  if (error) {
    return (
      <div className="w-full px-6 py-12 text-center">
        <p className="text-rose-600 font-semibold mb-4">{error}</p>
        <button type="button" onClick={() => onNavigate('/')} className="text-blue-600 underline">
          Kembali ke Beranda
        </button>
      </div>
    )
  }

  if (!post) {
    return <div className="w-full px-6 py-12 text-slate-500">Memuat artikel...</div>
  }

  return (
    <article className="w-full px-6 py-8">
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className="flex items-center gap-1.5 text-sm font-medium text-blue-600 mb-6 hover:underline"
      >
        <IconArrowLeft size={16} /> Kembali ke Daftar Artikel
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-4">
          {post.category}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
          <span className="flex items-center gap-1">
            <IconUser size={16} /> {post.author?.username || 'Penulis'}
          </span>
          <span>• {formatDate(post.published_at || post.created_at)}</span>
          <span className="flex items-center gap-1 text-blue-600 font-medium">
            <IconClock size={16} /> {post.reading_time_minutes || 1} menit baca
          </span>
        </div>

        <MarkdownViewer content={post.content} darkMode={darkMode} />
      </div>
    </article>
  )
}