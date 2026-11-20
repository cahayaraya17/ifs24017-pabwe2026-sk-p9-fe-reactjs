import { useEffect, useState } from 'react'
import { IconSearch, IconClock, IconUser } from '@tabler/icons-react'
import { fetchCategories, fetchPublicPosts } from '../api/blogApi'
import { formatDate } from '../../../helpers/toolsHelper'

export default function PublicArticleList({ onNavigate }) {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState(['Semua'])
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(['Semua', ...res.data]))
      .catch(() => setCategories(['Semua']))
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchPublicPosts(search, selectedCategory)
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [search, selectedCategory])

  return (
    <main className="w-full px-6 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Eksplorasi Artikel Publik</h1>
          <p className="text-slate-600 dark:text-slate-400">Baca wawasan terbaru seputar teknologi, pendidikan, dan bisnis.</p>
        </div>

        <div className="relative w-full md:w-80">
          <IconSearch size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul atau topik..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-500">Memuat artikel...</p>
      ) : posts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-slate-500">Belum ada artikel yang dipublikasikan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => onNavigate(`/posts/${post.slug}`)}
              className="cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 mb-3">
                  {post.category}
                </span>
                <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
                  {post.excerpt || post.content}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <IconUser size={14} /> {post.author?.username || 'Penulis'} • {formatDate(post.published_at || post.created_at)}
                </span>
                <span className="flex items-center gap-1 font-medium text-blue-600">
                  <IconClock size={14} /> {post.reading_time_minutes || 1} mnt baca
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}