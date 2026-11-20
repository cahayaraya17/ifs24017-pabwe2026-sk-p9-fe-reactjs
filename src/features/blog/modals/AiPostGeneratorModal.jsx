import { useState } from 'react'
import { generateAiBlog } from '../api/blogApi'
import { showErrorAlert } from '../../../helpers/toolsHelper'

export default function AiPostGeneratorModal({ onClose, onApplyDraft }) {
  const [topic, setTopic] = useState('')
  const [category, setCategory] = useState('Teknologi')
  const [includeWebSearch, setIncludeWebSearch] = useState(true)
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(null)

  const handleGenerate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await generateAiBlog({
        topic,
        category,
        include_web_search: includeWebSearch,
      })
      setGenerated(res.data)
    } catch (err) {
      await showErrorAlert('AI Generator Gagal', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-2">
      <div className="w-full max-w-[96vw] h-[94vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between">
          <h2 className="text-lg font-bold">AI Blog Generator + Search Engine</h2>
          <button type="button" onClick={onClose} className="text-white/80 hover:text-white font-bold">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Topik Artikel</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Contoh: Perkembangan Golang 1.27 untuk Microservices"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
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

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeWebSearch}
                  onChange={(e) => setIncludeWebSearch(e.target.checked)}
                />
                <span className="text-sm font-medium">Sertakan Penelusuran Mesin Pencari (Search Engine)</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                {loading ? 'Menghasilkan Draf...' : 'Generate Artikel AI'}
              </button>
            </div>
          </form>

          {generated && (
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
              <h3 className="text-xl font-bold">{generated.title}</h3>
              <p className="text-sm text-slate-500">{generated.excerpt}</p>
              <pre className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs whitespace-pre-wrap">
                {generated.content}
              </pre>
              {generated.search_sources?.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold mb-2">Sumber Penelusuran Web:</h4>
                  <ul className="list-disc pl-5 text-xs space-y-1">
                    {generated.search_sources.map((src, i) => (
                      <li key={i}>
                        <a href={src.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                          {src.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-slate-300 dark:border-slate-600 font-medium"
          >
            Batal
          </button>
          {generated && (
            <button
              type="button"
              onClick={() => onApplyDraft(generated)}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Terapkan ke Editor
            </button>
          )}
        </div>
      </div>
    </div>
  )
}