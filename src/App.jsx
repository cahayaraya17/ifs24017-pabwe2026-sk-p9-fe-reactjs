import { lazy, Suspense, useEffect, useState } from 'react'
import { clearAuthSession, getStoredUser } from './helpers/apiHelper'
import { logoutUser } from './features/auth/api/authApi'
import { useTheme } from './hooks/useTheme'
import StickyNavbar from './features/blog/components/StickyNavbar'
import PublicArticleList from './features/blog/components/PublicArticleList'

const PublicArticleDetail = lazy(() => import('./features/blog/components/PublicArticleDetail'))
const AuthorDashboard = lazy(() => import('./features/blog/components/AuthorDashboard'))
const AdminDashboard = lazy(() => import('./features/admin/components/AdminDashboard'))
const AuthPage = lazy(() => import('./features/auth/components/AuthPage'))

const PageFallback = () => (
  <main className="min-h-screen flex items-center justify-center text-slate-500">
    Memuat halaman...
  </main>
)

export default function App() {
  const [path, setPath] = useState(() => window.location.pathname)
  const [user, setUser] = useState(() => getStoredUser())
  const { darkMode, toggleTheme } = useTheme()

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (to) => {
    window.history.pushState({}, '', to)
    setPath(to)
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch {
      // ignore network error on logout
    }
    clearAuthSession()
    setUser(null)
    navigate('/')
  }

  if (path === '/login' || path === '/register') {
    return (
      <Suspense fallback={<PageFallback />}>
        <AuthPage
          mode={path === '/register' ? 'register' : 'login'}
          onNavigate={navigate}
          onSuccess={(loggedUser) => {
            setUser(loggedUser)
            navigate(loggedUser.role === 'admin' ? '/admin' : '/author')
          }}
        />
      </Suspense>
    )
  }

  let content
  if (path.startsWith('/posts/')) {
    const slug = path.replace('/posts/', '')
    content = <PublicArticleDetail slug={slug} darkMode={darkMode} onNavigate={navigate} />
  } else if (path === '/author') {
    content = user ? (
      <AuthorDashboard darkMode={darkMode} />
    ) : (
      <AuthPage mode="login" onNavigate={navigate} onSuccess={(u) => { setUser(u); navigate('/author') }} />
    )
  } else if (path === '/admin') {
    content = user?.role === 'admin' ? (
      <AdminDashboard />
    ) : (
      <PublicArticleList onNavigate={navigate} />
    )
  } else {
    content = <PublicArticleList onNavigate={navigate} />
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <StickyNavbar
        user={user}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
      <Suspense fallback={<PageFallback />}>
        {content}
      </Suspense>
    </div>
  )
}