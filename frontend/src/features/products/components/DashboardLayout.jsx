import { useState } from 'react'
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

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-white
          transition-transform duration-300 lg:static lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 font-display text-sm font-bold shadow-lg shadow-violet-600/30">
            B
          </div>
          <div>
            <div className="font-display text-sm font-semibold tracking-tight">Biashara HUB</div>
            <div className="text-[10px] text-slate-400 font-mono">v2.4.1</div>
          </div>
          <button
            className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-white/10 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
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
                <Icon className="w-5 h-5 shrink-0" />
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
            <button className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10">
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md sm:px-6">
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </button>

          <div className="relative hidden flex-1 max-w-xl sm:block">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search products, SKUs..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-16 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-500/20"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
              ⌘K
            </kbd>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
              <BellIcon />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 sm:flex">
              AM
            </div>
            <button
              onClick={() => navigate('/products/new')}
              className="btn-action flex items-center gap-1.5 rounded-xl bg-violet-600 px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-700"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}