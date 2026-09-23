import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProduct, deleteProduct, formatTZS } from '../services/productService'
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  SparkleIcon,
  PackageIcon,
} from '../components/Icons'

function StockBadge({ status, stock }) {
  if (status === 'out_of_stock' || stock === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
        Out of Stock
      </span>
    )
  }
  if (status === 'low_stock' || stock <= 10) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        {stock} Low stock
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {stock} In Stock
    </span>
  )
}

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const p = await getProduct(id)
        if (alive) setProduct(p)
      } catch (e) {
        if (alive) setError(e.message || 'Not found')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteProduct(id)
      navigate('/products')
    } catch {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div className="skeleton h-8 w-40" />
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="skeleton aspect-square rounded-2xl lg:col-span-2" />
          <div className="space-y-3 lg:col-span-3">
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-24 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-lg p-12 text-center">
        <PackageIcon className="mx-auto h-12 w-12 text-slate-300" />
        <h2 className="mt-4 font-display text-lg font-semibold text-slate-800">Product not found</h2>
        <p className="mt-1 text-sm text-slate-500">{error}</p>
        <Link to="/products" className="mt-4 inline-block text-sm font-semibold text-violet-600">
          ← Back to catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-bold text-slate-900 line-clamp-1">
              {product.name}
            </h1>
            <p className="text-sm text-slate-400">
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600">
                {product.sku}
              </code>
              <span className="mx-2">·</span>
              {product.location} · Updated {product.lastUpdated}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-action flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-100"
          >
            <SparkleIcon className="h-4 w-4" />
            AI Post
          </button>
          <Link
            to={`/products/${id}/edit`}
            className="btn-action flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="btn-action flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
            <div className="aspect-square bg-slate-100">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-display text-3xl font-bold tabular-nums text-slate-900">
                  {formatTZS(product.price)}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StockBadge status={product.stockStatus} stock={product.stock} />
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${
                      product.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                        : product.status === 'draft'
                          ? 'bg-slate-100 text-slate-600 ring-slate-200'
                          : 'bg-slate-50 text-slate-500 ring-slate-200'
                    }`}
                  >
                    {product.status}
                  </span>
                  <span className="inline-flex rounded-lg bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-100">
                    {product.category}
                  </span>
                </div>
              </div>
            </div>

            {product.description && (
              <div className="mt-5 border-t border-slate-100 pt-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Description
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{product.description}</p>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Contact</h3>
              <p className="mt-2 text-sm font-medium text-slate-800">{product.contact || '—'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Location</h3>
              <p className="mt-2 text-sm font-medium text-slate-800">{product.location}</p>
            </div>
          </div>

          {product.deliveryInfo && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Delivery information
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{product.deliveryInfo}</p>
            </div>
          )}
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setConfirmDelete(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl fade-in">
            <h3 className="font-display text-lg font-semibold text-slate-900">Delete Product</h3>
            <p className="mt-2 text-sm text-slate-500">
              Permanently delete <span className="font-medium text-slate-800">&quot;{product.name}&quot;</span>?
              This cannot be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="btn-action flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="btn-action flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}