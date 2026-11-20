import { IconSun, IconMoon, IconArticle, IconLayoutDashboard, IconShieldLock, IconLogout } from '@tabler/icons-react'

export default function StickyNavbar({ user, darkMode, onToggleTheme, onNavigate, onLogout }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 text-xl font-bold text-blue-600"
        >
          <IconArticle size={26} />
          <span>Delcom Blog</span>
        </button>

        <nav className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {darkMode ? <IconSun size={18} /> : <IconMoon size={18} />}
          </button>

          {user ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate('/author')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-medium text-sm"
              >
                <IconLayoutDashboard size={16} />
                Workspace
              </button>
              {user.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => onNavigate('/admin')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-medium text-sm"
                >
                  <IconShieldLock size={16} />
                  Admin
                </button>
              )}
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700"
              >
                <IconLogout size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="px-4 py-1.5 rounded-lg border border-blue-600 text-blue-600 font-medium text-sm hover:bg-blue-50"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/register')}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700"
              >
                Register
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}