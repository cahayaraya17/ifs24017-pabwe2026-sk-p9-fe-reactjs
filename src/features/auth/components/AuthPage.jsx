import { useState } from 'react'
import { loginUser, registerUser } from '../api/authApi'
import { setAuthSession } from '../../../helpers/apiHelper'
import { showErrorAlert, showSuccessAlert } from '../../../helpers/toolsHelper'

export default function AuthPage({ mode = 'login', onSuccess, onNavigate }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const isLogin = mode === 'login'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        const res = await loginUser(username, password)
        setAuthSession(res.data.token, res.data.user)
        await showSuccessAlert('Login Berhasil', `Selamat datang, ${res.data.user.username}!`)
        onSuccess(res.data.user)
      } else {
        await registerUser(username, email, password)
        await showSuccessAlert('Registrasi Berhasil', 'Silakan login dengan akun baru Anda.')
        onNavigate('/login')
      }
    } catch (err) {
      await showErrorAlert(isLogin ? 'Login Gagal' : 'Registrasi Gagal', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">
          {isLogin ? 'Masuk ke Delcom Blog' : 'Daftar Akun Penulis'}
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          {isLogin ? 'Kelola dan publikasikan artikel terbaik Anda.' : 'Bergabunglah sebagai penulis artikel.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              id="login-username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
              placeholder="Masukkan username"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                id="register-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                placeholder="nama@email.com"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
              placeholder="Masukkan password"
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            {loading ? 'Memproses...' : isLogin ? 'Login' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="mt-6 flex justify-between text-sm text-slate-600 dark:text-slate-400">
          <button type="button" onClick={() => onNavigate('/')} className="hover:underline">
            â† Beranda Publik
          </button>
          <button
            type="button"
            onClick={() => onNavigate(isLogin ? '/register' : '/login')}
            className="text-blue-600 font-medium hover:underline"
          >
            {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Login'}
          </button>
        </div>
      </div>
    </main>
  )
}
