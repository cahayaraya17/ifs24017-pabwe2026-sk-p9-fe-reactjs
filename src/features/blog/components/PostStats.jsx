export default function PostStats({ stats = { total: 0, published: 0, draft: 0 } }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="p-5 rounded-xl bg-blue-600 text-white shadow">
        <p className="text-sm opacity-90">Total Artikel</p>
        <p className="text-3xl font-bold mt-1">{stats.total}</p>
      </div>
      <div className="p-5 rounded-xl bg-emerald-600 text-white shadow">
        <p className="text-sm opacity-90">Total Terbit</p>
        <p className="text-3xl font-bold mt-1">{stats.published}</p>
      </div>
      <div className="p-5 rounded-xl bg-amber-500 text-white shadow">
        <p className="text-sm opacity-90">Belum Selesai (Draf)</p>
        <p className="text-3xl font-bold mt-1">{stats.draft}</p>
      </div>
    </div>
  )
}