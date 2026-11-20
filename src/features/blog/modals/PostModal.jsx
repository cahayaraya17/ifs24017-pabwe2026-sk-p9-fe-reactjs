import { useState } from 'react'
import MarkdownEditor from '../../../components/MarkdownEditor'

export default function PostModal({ initialData, darkMode, onClose, onSave }) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [category, setCategory] = useState(initialData?.category || 'Teknologi')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [isPublished, setIsPublished] = useState(Boolean(initialData?.is_published))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ title, category, excerpt, content, is_published: isPublished })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-2">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[96vw] h-[94vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="px-6 py-4 bg-blue-600 text-white flex items-center justify-between">
          <h2 className="text-lg font-bold">{initialData?.id ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h2>
          <button type="button" onClick={onClose} className="text-white/80 hover:text-white font-bold">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Judul Artikel</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                placeholder="Judul artikel menarik..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {['Teknologi', 'Pendidikan', 'Gaya Hidup', 'Bisnis', 'Opini', 'Umum'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ringkasan (Excerpt)</label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
              placeholder="Ringkasan singkat artikel..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Konten Artikel (Markdown)</label>
            <MarkdownEditor value={content} onChange={setContent} darkMode={darkMode} />
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            <span className="text-sm font-medium">Langsung Publikasikan Artikel</span>
          </label>
        </div>

        <div className="px-6 py-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-slate-300 dark:border-slate-600 font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Simpan Artikel
          </button>
        </div>
      </form>
    </div>
  )
}