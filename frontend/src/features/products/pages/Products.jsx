import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getProducts,
  deleteProduct,
  formatTZS,
  CATEGORIES,
  LOCATIONS,
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
  FilterIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from '../components/Icons'

function StockBadge({ status, stock }) {
  if (status === 'out_of_stock' || stock === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
        Out of Stock
      </span>
    )
  }
  if (status === 'low_stock' || stock <= 10) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        {stock} Low
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {stock} In Stock
    </span>
  )
}

function StatusPill({ status }) {
  const map = {
    active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    draft: 'bg-slate-100 text-slate-600 ring-slate-200',
    archived: 'bg-slate-50 text-slate-500 ring-slate-200',
  }
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${map[status] || map.draft}`}
    >
      {status}
    </span>
  )
}

function CategoryTag({ category }) {
  return (
    <span className="inline-flex rounded-lg bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-100">
      {category}
    </span>
  )
}

function DeleteModal({ product, onClose, onConfirm, loading }) {
  if (!product) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl fade-in">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50">
            <TrashIcon className="h-5 w-5 text-rose-500" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-slate-900">Delete Product</h3>
            <p className="mt-1 text-sm text-slate-500">
              Are you sure you want to delete{' '}
              <span className="font-medium text-slate-800">&quot;{product.name}&quot;</span>? This
              action cannot be undone.
            </p>
          </div>
        </div>
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
          <p className="text-xs text-rose-600">
            This will permanently remove the product, all its variants, and associated media files.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-action flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
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
    type === 'error'
      ? 'bg-rose-600'
      : type === 'info'
        ? 'bg-violet-600'
        : 'bg-emerald-600'
  return (
    <div className="fixed bottom-6 right-6 z-[60] fade-in">
      <div className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl ${colors}`}>
        <span>{message}</span>
        <button onClick={onClose} className="rounded-lg p-0.5 hover:bg-white/20">
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function SkeletonRows() {
  return (
    <div className="space-y-0 divide-y divide-slate-100">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4">
          <div className="skeleton h-11 w-11 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3.5 w-40" />
            <div className="skeleton h-3 w-24" />
          </div>
          <div className="skeleton hidden h-6 w-20 rounded-lg sm:block" />
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
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
  const [activeTab, setActiveTab] = useState('all')
  const [category, setCategory] = useState('All Categories')
  const [location, setLocation] = useState('All Locations')
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
      if (activeTab !== 'all' && p.status !== activeTab) return false
      if (category !== 'All Categories' && p.category !== category) return false
      if (location !== 'All Locations' && p.location !== location) return false
      if (search) {
        const q = search.toLowerCase()
        if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [products, activeTab, category, location, search])

  const counts = useMemo(
    () => ({
      all: products.length,
      active: products.filter((p) => p.status === 'active').length,
      draft: products.filter((p) => p.status === 'draft').length,
      archived: products.filter((p) => p.status === 'archived').length,
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
      value: products.filter((p) => p.stockStatus === 'low_stock' || (p.stock > 0 && p.stock <= 10)).length,
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

  const tabs = [
    { key: 'all', label: 'All Products', count: counts.all },
    { key: 'active', label: 'Active', count: counts.active },
    { key: 'draft', label: 'Drafts', count: counts.draft },
    { key: 'archived', label: 'Archived', count: counts.archived },
  ]

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Product Catalog
          </h1>
          <p className="mt-1 text-sm text-slate-500">
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <div
              key={k.label}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card transition hover:shadow-elevated"
            >
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {k.label}
                </span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    k.warn ? 'bg-amber-50 text-amber-600' : 'bg-violet-50 text-violet-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 font-display text-2xl font-bold tabular-nums text-slate-900">
                {k.value}
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                <span className={k.trendUp ? 'font-semibold text-emerald-600' : 'font-semibold text-amber-600'}>
                  {k.trendUp ? '↗' : '↘'} {k.trend}
                </span>
                <span className="text-slate-400">{k.sub}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white shadow-card">
        <div className="flex items-center gap-2 border-b border-violet-100/80 px-5 py-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white">
            <SparkleIcon className="h-3.5 w-3.5" />
          </div>
          <span className="font-display text-sm font-semibold text-slate-800">AI Insights</span>
          <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">
            3 new
          </span>
        </div>
        <div className="space-y-3 p-4 sm:p-5">
          <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
            <div className="flex items-start gap-3">
              <RocketIcon className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-800">Boost Zanzibar Spice Set</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  This product has 3× higher engagement on Instagram Stories vs. static posts. Schedule
                  a Reels campaign this Friday for peak reach.
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

          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
            <div className="flex items-start gap-3">
              <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-800">Restock Alert: Maasai Sandals</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  At current sell-through rate, you will stock out in ~4 days. Supplier lead time is 7
                  days — order today to avoid lost revenue.
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

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
            <div className="flex items-start gap-3">
              <LightbulbIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-800">Bundle Opportunity Detected</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
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

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 px-4 pt-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={`relative px-3 py-2.5 text-sm font-medium transition ${
                activeTab === t.key ? 'text-violet-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] tabular-nums ${
                  activeTab === t.key
                    ? 'bg-violet-100 text-violet-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {t.count}
              </span>
              {activeTab === t.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-violet-600" />
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <FilterIcon className="h-3.5 w-3.5" />
            Filter:
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
          >
            <option>All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
          >
            <option>All Locations</option>
            {LOCATIONS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <div className="relative ml-auto w-full sm:w-56">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or SKU…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <span className="text-xs text-slate-400 tabular-nums">{filtered.length} results</span>
        </div>

        {loading && <SkeletonRows />}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50">
              <AlertIcon className="h-6 w-6 text-rose-500" />
            </div>
            <h3 className="font-display text-base font-semibold text-slate-800">Something went wrong</h3>
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
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="relative mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <PackageIcon className="h-8 w-8 text-slate-400" />
              </div>
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-800">No products found</h3>
            <p className="mt-1 max-w-xs text-sm text-slate-400">
              {search
                ? `No results for "${search}". Try a different search term.`
                : 'This filter has no products yet. Start by adding your first product.'}
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-3 py-3 font-semibold">SKU</th>
                  <th className="px-3 py-3 font-semibold">Category</th>
                  <th className="px-3 py-3 font-semibold">Price</th>
                  <th className="px-3 py-3 font-semibold">Stock</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="product-row group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="img-zoom-wrap h-11 w-11 shrink-0 rounded-lg bg-slate-100 ring-1 ring-slate-200/80">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={`/products/${p.id}`}
                            className="block truncate text-sm font-semibold text-slate-800 hover:text-violet-700"
                          >
                            {p.name}
                          </Link>
                          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            {p.location} · {p.lastUpdated}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-600">
                        {p.sku}
                      </code>
                    </td>
                    <td className="px-3 py-3">
                      <CategoryTag category={p.category} />
                    </td>
                    <td className="px-3 py-3 text-sm font-semibold tabular-nums text-slate-800">
                      {formatTZS(p.price)}
                    </td>
                    <td className="px-3 py-3">
                      <StockBadge status={p.stockStatus} stock={p.stock} />
                    </td>
                    <td className="px-3 py-3">
                      <StatusPill status={p.status} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-80 transition group-hover:opacity-100">
                        <Link
                          to={`/products/${p.id}/edit`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/products/${p.id}`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          title="View"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-violet-500 hover:bg-violet-50"
                          title="AI insights"
                          onClick={() =>
                            setToast({ message: `AI insight for ${p.name}`, type: 'info' })
                          }
                        >
                          <SparkleIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          title="Delete"
                          onClick={() => setDeleteTarget(p)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-400">
            <span>
              Showing {filtered.length} of {products.length} products
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-xs font-semibold text-white"
              >
                1
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100"
              >
                2
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100"
              >
                3
              </button>
            </div>
          </div>
        )}
      </div>

      <DeleteModal
        product={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  )
}