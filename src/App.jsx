import { useEffect, useState } from 'react'
import { clearAuthSession, getStoredUser } from './helpers/apiHelper'
import { logoutUser } from './features/auth/api/authApi'
import { useTheme } from './hooks/useTheme'
import StickyNavbar from './features/blog/components/StickyNavbar'
import PublicArticleList from './features/blog/components/PublicArticleList'
import PublicArticleDetail from './features/blog/components/PublicArticleDetail'
import AuthorDashboard from './features/blog/components/AuthorDashboard'
import AdminDashboard from './features/admin/components/AdminDashboard'
import AuthPage from './features/auth/components/AuthPage'

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
      <AuthPage
        mode={path === '/register' ? 'register' : 'login'}
        onNavigate={navigate}
        onSuccess={(loggedUser) => {
          setUser(loggedUser)
          navigate(loggedUser.role === 'admin' ? '/admin' : '/author')
        }}
      />
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
      {content}
    </div>
  )
}