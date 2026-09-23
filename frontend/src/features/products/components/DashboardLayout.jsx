import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutIcon,
  PackageIcon,
  CartIcon,
  UsersIcon,
  ChartIcon,
  TagIcon,
  TruckIcon,
  SettingsIcon,
  SearchIcon,
  BellIcon,
  PlusIcon,
  MenuIcon,
  XIcon,
  SunIcon,
  MoonIcon,
} from './Icons'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutIcon, badge: null },
  { to: '/products', label: 'Products', icon: PackageIcon, badge: 284 },
  { to: '/orders', label: 'Orders', icon: CartIcon, badge: 12 },
  { to: '/customers', label: 'Customers', icon: UsersIcon, badge: null },
  { to: '/analytics', label: 'Analytics', icon: ChartIcon, badge: null },
  { to: '/promotions', label: 'Promotions', icon: TagIcon, badge: null },
  { to: '/shipping', label: 'Shipping', icon: TruckIcon, badge: null },
  { to: '/settings', label: 'Settings', icon: SettingsIcon, badge: null },
]

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem('bh_theme')
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lang, setLang] = useState(() => localStorage.getItem('bh_lang') || 'en')
  const [theme, setTheme] = useState(getInitialTheme)
  const navigate = useNavigate()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('bh_theme', theme)
  }, [theme])

  const toggleLang = (next) => {
    setLang(next)
    localStorage.setItem('bh_lang', next)
  }

  const toggleTheme = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-white
          transition-transform duration-300 lg:static lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 font-display text-sm font-bold shadow-lg shadow-violet-600/30">
            B
          </div>
          <div>
            <div className="font-display text-sm font-semibold tracking-tight">Biashara HUB</div>
            <div className="font-mono text-[10px] text-slate-400">v2.4.1</div>
          </div>
          <button
            type="button"
            className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-white/10 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {NAV.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge != null && (
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold tabular-nums">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500 text-xs font-bold">
              AM
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">Amani Mwangi</div>
              <div className="truncate text-xs text-slate-400">Store Owner</div>
            </div>
            <button type="button" className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10">
              <SettingsIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </button>

          <div className="relative hidden max-w-xl flex-1 sm:block">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search products, SKUs..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-16 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-violet-500 dark:focus:bg-slate-800"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-500">
              ⌘K
            </kbd>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
            {/* Language switcher */}
            <div
              role="group"
              aria-label="Language"
              className="relative flex items-center rounded-full border border-slate-200/90 bg-slate-100/80 p-0.5 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80"
            >
              <button
                type="button"
                onClick={() => toggleLang('en')}
                aria-pressed={lang === 'en'}
                className={`relative z-10 min-w-[2.25rem] rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide transition-all duration-200 ${
                  lang === 'en'
                    ? 'bg-white text-violet-700 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-700 dark:text-violet-300 dark:ring-slate-600'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => toggleLang('sw')}
                aria-pressed={lang === 'sw'}
                className={`relative z-10 min-w-[2.25rem] rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide transition-all duration-200 ${
                  lang === 'sw'
                    ? 'bg-white text-violet-700 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-700 dark:text-violet-300 dark:ring-slate-600'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                SW
              </button>
            </div>

            {/* Dark / Light theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              className="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200/90 bg-slate-100/80 text-slate-600 shadow-sm transition-all duration-300 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-amber-300 dark:hover:border-amber-500/40 dark:hover:bg-slate-700 dark:hover:text-amber-200"
            >
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                  theme === 'dark'
                    ? 'scale-100 rotate-0 opacity-100'
                    : 'scale-50 -rotate-90 opacity-0'
                }`}
              >
                <SunIcon className="h-4 w-4" />
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                  theme === 'light'
                    ? 'scale-100 rotate-0 opacity-100'
                    : 'scale-50 rotate-90 opacity-0'
                }`}
              >
                <MoonIcon className="h-4 w-4" />
              </span>
            </button>

            <button
              type="button"
              className="relative rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Notifications"
            >
              <BellIcon />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 sm:flex">
              AM
            </div>

            <button
              type="button"
              onClick={() => navigate('/products/new')}
              className="btn-action flex items-center gap-1.5 rounded-xl bg-violet-600 px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-700"
            >
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Add Product</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto dark:bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  )
}