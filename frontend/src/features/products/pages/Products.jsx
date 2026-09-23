import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getProducts,
  deleteProduct,
  formatTZS,
  CATEGORIES,
} from '../services/productService'
import {
  PackageIcon,
  TrendUpIcon,
  AlertIcon,
  ChartIcon,
  SparkleIcon,
  RocketIcon,
  LightbulbIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from '../components/Icons'

function DeleteModal({ product, onClose, onConfirm, loading }) {
  if (!product) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl fade-in dark:bg-slate-900 dark:ring-1 dark:ring-slate-700">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-500/10">
            <TrashIcon className="h-5 w-5 text-rose-500" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              Delete Product
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete{' '}
              <span className="font-medium text-slate-800 dark:text-slate-200">
                &quot;{product.name}&quot;
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3 dark:border-rose-500/20 dark:bg-rose-500/10">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
          <p className="text-xs text-rose-600 dark:text-rose-400">
            This will permanently remove the product and associated media files.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-action flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="btn-action flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {loading ? 'Deleting…' : 'Delete Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Toast({ message, type = 'success', onClose }) {
  if (!message) return null
  const colors =
    type === 'error' ? 'bg-rose-600' : type === 'info' ? 'bg-violet-600' : 'bg-emerald-600'
  return (
    <div className="fixed bottom-6 right-6 z-[60] fade-in">
      <div
        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl ${colors}`}
      >
        <span>{message}</span>
        <button type="button" onClick={onClose} className="rounded-lg p-0.5 hover:bg-white/20">
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    active: 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30',
    draft: 'bg-slate-500 text-white',
    archived: 'bg-slate-400 text-white',
  }
  return (
    <span
      className={`absolute right-1.5 top-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-semibold capitalize ${styles[status] || styles.draft}`}
    >
      {status}
    </span>
  )
}

function ProductCard({ product, onDelete, onAi }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition hover:border-violet-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-500/30">
      {/* Compact image */}
      <div className="relative h-28 overflow-hidden bg-slate-100 sm:h-32 dark:bg-slate-800">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <StatusBadge status={product.status} />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        <h3 className="font-display text-[13px] font-semibold leading-snug text-slate-900 line-clamp-1 dark:text-slate-100">
          {product.name}
        </h3>
        <p className="line-clamp-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
          {product.description || `${product.category} · ${product.location}`}
        </p>

        <div className="mt-auto flex items-center justify-between gap-1.5 pt-0.5">
          <div className="font-display text-[13px] font-bold tabular-nums text-slate-900 dark:text-white">
            {formatTZS(product.price)}
          </div>
          <span
            className={`text-[10px] font-medium ${
              product.stock === 0
                ? 'text-rose-600'
                : product.stock <= 10
                  ? 'text-amber-600'
                  : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {product.stock === 0 ? 'Out of stock' : `Stock: ${product.stock}`}
          </span>
        </div>

        <div className="flex items-center gap-1.5 pt-0.5">
          <Link
            to={`/products/${product.id}`}
            className="btn-action flex flex-1 items-center justify-center rounded-lg bg-slate-900 py-1.5 text-[11px] font-semibold text-white transition hover:bg-slate-800 dark:bg-violet-600 dark:hover:bg-violet-500"
          >
            View
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="More actions"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="6" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="18" r="1.5" />
              </svg>
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute bottom-full right-0 z-20 mb-1 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-elevated dark:border-slate-700 dark:bg-slate-800">
                  <Link
                    to={`/products/${product.id}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    <EyeIcon className="h-4 w-4" /> View
                  </Link>
                  <Link
                    to={`/products/${product.id}/edit`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    <PencilIcon className="h-4 w-4" /> Edit
                  </Link>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-500/10"
                    onClick={() => {
                      setMenuOpen(false)
                      onAi?.(product)
                    }}
                  >
                    <SparkleIcon className="h-4 w-4" /> AI insight
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                    onClick={() => {
                      setMenuOpen(false)
                      onDelete?.(product)
                    }}
                  >
                    <TrashIcon className="h-4 w-4" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function SkeletonCards() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="skeleton h-28 w-full rounded-none sm:h-32" />
          <div className="space-y-1.5 p-2.5">
            <div className="skeleton h-3 w-3/4" />
            <div className="skeleton h-2.5 w-full" />
            <div className="flex justify-between pt-0.5">
              <div className="skeleton h-3 w-16" />
              <div className="skeleton h-2.5 w-10" />
            </div>
            <div className="skeleton h-7 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [status, setStatus] = useState('All Status')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (e) {
      setError(e.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (status !== 'All Status' && p.status !== status.toLowerCase()) return false
      if (category !== 'All Categories' && p.category !== category) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.sku.toLowerCase().includes(q) &&
          !(p.description || '').toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [products, category, status, search])

  const counts = useMemo(
    () => ({
      all: products.length,
      active: products.filter((p) => p.status === 'active').length,
      lowStock: products.filter(
        (p) => p.stockStatus === 'low_stock' || (p.stock > 0 && p.stock <= 10)
      ).length,
    }),
    [products]
  )

  const kpis = [
    {
      label: 'TOTAL PRODUCTS',
      value: products.length,
      trend: '+12%',
      sub: 'This week',
      icon: PackageIcon,
      trendUp: true,
    },
    {
      label: 'ACTIVE ITEMS',
      value: counts.active,
      trend: '+5%',
      sub: 'vs last week',
      icon: TrendUpIcon,
      trendUp: true,
    },
    {
      label: 'LOW STOCK ALERTS',
      value: counts.lowStock,
      trend: '+2',
      sub: 'Need reorder',
      icon: AlertIcon,
      trendUp: false,
      warn: true,
    },
    {
      label: 'INVENTORY VALUE',
      value: 'TZS 42.8M',
      trend: '+8.3%',
      sub: 'Total valuation',
      icon: ChartIcon,
      trendUp: true,
    },
  ]

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteProduct(deleteTarget.id)
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      setToast({ message: `"${deleteTarget.name}" deleted`, type: 'success' })
      setDeleteTarget(null)
    } catch {
      setToast({ message: 'Failed to delete product', type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Product Catalog
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage and track all your Biashara HUB inventory
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live sync active
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <div
              key={k.label}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card transition hover:shadow-elevated dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {k.label}
                </span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    k.warn
                      ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10'
                      : 'bg-violet-50 text-violet-600 dark:bg-violet-500/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                {k.value}
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                <span
                  className={
                    k.trendUp
                      ? 'font-semibold text-emerald-600'
                      : 'font-semibold text-amber-600'
                  }
                >
                  {k.trendUp ? '↗' : '↘'} {k.trend}
                </span>
                <span className="text-slate-400">{k.sub}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* AI Insights */}
      <div className="overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white shadow-card dark:border-violet-500/20 dark:from-violet-500/10 dark:to-slate-900">
        <div className="flex items-center gap-2 border-b border-violet-100/80 px-5 py-3 dark:border-violet-500/20">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white">
            <SparkleIcon className="h-3.5 w-3.5" />
          </div>
          <span className="font-display text-sm font-semibold text-slate-800 dark:text-slate-100">
            AI Insights
          </span>
          <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">
            3 new
          </span>
        </div>
        <div className="space-y-3 p-4 sm:p-5">
          <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4 dark:border-violet-500/20 dark:bg-violet-500/5">
            <div className="flex items-start gap-3">
              <RocketIcon className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Boost Zanzibar Spice Set
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  This product has 3× higher engagement on Instagram Stories vs. static posts.
                  Schedule a Reels campaign this Friday for peak reach.
                </p>
                <button
                  type="button"
                  onClick={() => setToast({ message: 'AI post generation started…', type: 'info' })}
                  className="btn-action mt-3 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
                >
                  Generate Post
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
            <div className="flex items-start gap-3">
              <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Restock Alert: Maasai Sandals
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  At current sell-through rate, you will stock out in ~4 days. Supplier lead time is
                  7 days — order today to avoid lost revenue.
                </p>
                <button
                  type="button"
                  onClick={() => setToast({ message: 'Purchase order drafted', type: 'success' })}
                  className="btn-action mt-3 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600"
                >
                  Create PO
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/5">
            <div className="flex items-start gap-3">
              <LightbulbIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Bundle Opportunity Detected
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Customers who buy Kitenge Dress also view Kanga Fabric 68% of the time. Create a
                  &quot;Style Bundle&quot; to increase AOV by est. +TZS 12,000.
                </p>
                <button
                  type="button"
                  onClick={() => setToast({ message: 'Bundle wizard opened', type: 'info' })}
                  className="btn-action mt-3 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Create Bundle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-500"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <option>All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Draft</option>
          <option>Archived</option>
        </select>
      </div>

      {/* Product cards grid */}
      {loading && <SkeletonCards />}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-500/10">
            <AlertIcon className="h-6 w-6 text-rose-500" />
          </div>
          <h3 className="font-display text-base font-semibold text-slate-800 dark:text-slate-100">
            Something went wrong
          </h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">{error}</p>
          <button
            type="button"
            onClick={load}
            className="btn-action mt-4 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <PackageIcon className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="font-display text-lg font-semibold text-slate-800 dark:text-slate-100">
            No products found
          </h3>
          <p className="mt-1 max-w-xs text-sm text-slate-400">
            {search
              ? `No results for "${search}". Try a different search.`
              : 'Start by adding your first product to the catalog.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/products/new')}
            className="btn-action mt-5 flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-700"
          >
            <PlusIcon className="h-4 w-4" />
            Add First Product
          </button>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onDelete={setDeleteTarget}
                onAi={(prod) =>
                  setToast({ message: `AI insight for ${prod.name}`, type: 'info' })
                }
              />
            ))}
          </div>
          <p className="text-center text-xs text-slate-400">
            Showing {filtered.length} of {products.length} products
          </p>
        </>
      )}

      <DeleteModal
        product={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  )
}
