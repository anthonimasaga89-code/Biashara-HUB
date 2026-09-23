import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  getProduct,
  updateProduct,
  uploadProductMedia,
  CATEGORIES,
  LOCATIONS,
} from '../services/productService'
import { ArrowLeftIcon, UploadIcon, XIcon } from '../components/Icons'

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [previews, setPreviews] = useState([])
  const [files, setFiles] = useState([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const p = await getProduct(id)
        if (!alive) return
        setForm({
          name: p.name || '',
          sku: p.sku || '',
          description: p.description || '',
          price: String(p.price ?? ''),
          stock: String(p.stock ?? ''),
          category: p.category || CATEGORIES[0],
          location: p.location || LOCATIONS[0],
          contact: p.contact || '',
          deliveryInfo: p.deliveryInfo || '',
          status: p.status || 'active',
          image: p.image,
        })
        if (p.image) {
          setPreviews([{ name: 'Current', url: p.image, existing: true }])
        }
      } catch (e) {
        if (alive) setError(e.message || 'Product not found')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [id])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const onFiles = (e) => {
    const list = Array.from(e.target.files || [])
    if (!list.length) return
    setFiles((prev) => [...prev, ...list])
    setPreviews((prev) => [
      ...prev,
      ...list.map((f) => ({ name: f.name, url: URL.createObjectURL(f), file: f })),
    ])
  }

  const removePreview = (idx) => {
    setPreviews((prev) => {
      const next = [...prev]
      if (!next[idx].existing) URL.revokeObjectURL(next[idx].url)
      next.splice(idx, 1)
      return next
    })
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await updateProduct(id, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
      })
      if (files.length) {
        setUploading(true)
        for (const file of files) {
          await uploadProductMedia(id, file, setProgress)
        }
        setUploading(false)
      }
      navigate(`/products/${id}`)
    } catch (err) {
      setError(err.message || 'Failed to update product')
      setSubmitting(false)
      setUploading(false)
    }
  }

  const field =
    'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-violet-500'
  const label =
    'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'
  const card =
    'rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900'
  const title = 'font-display text-sm font-semibold text-slate-800 dark:text-slate-100'

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 p-6">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-40 w-full rounded-2xl" />
        <div className="skeleton h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (!form) {
    return (
      <div className="mx-auto max-w-lg p-8 text-center">
        <h2 className="font-display text-lg font-semibold text-slate-800 dark:text-slate-100">
          Product not found
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{error}</p>
        <Link to="/products" className="mt-4 inline-block text-sm font-semibold text-violet-600">
          ← Back to catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <Link
          to={`/products/${id}`}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Edit Product
          </h1>
          <p className="font-mono text-sm text-slate-500 dark:text-slate-400">{form.sku}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className={card}>
          <h2 className={title}>Media</h2>
          <div className="mt-4">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 px-6 py-8 transition hover:border-violet-300 hover:bg-violet-50/30 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:border-violet-500/50 dark:hover:bg-violet-500/5">
              <UploadIcon className="h-7 w-7 text-slate-400 dark:text-slate-500" />
              <span className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                Add more media
              </span>
              <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={onFiles} />
            </label>
          </div>
          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {previews.map((p, i) => (
                <div
                  key={p.url + i}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
                >
                  <img src={p.url} alt={p.name} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePreview(i)}
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/70 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {(uploading || progress > 0) && (
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Uploading…</span>
                <span className="font-mono tabular-nums">{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-violet-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </section>

        <section className={card}>
          <h2 className={title}>Product details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={label}>Product name *</label>
              <input className={field} value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label className={label}>SKU</label>
              <input className={field} value={form.sku} onChange={set('sku')} />
            </div>
            <div>
              <label className={label}>Status</label>
              <select className={field} value={form.status} onChange={set('status')}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Description</label>
              <textarea
                className={`${field} min-h-[100px] resize-y`}
                value={form.description}
                onChange={set('description')}
              />
            </div>
          </div>
        </section>

        <section className={card}>
          <h2 className={title}>Pricing & inventory</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Price (TZS) *</label>
              <input
                type="number"
                min="0"
                className={field}
                value={form.price}
                onChange={set('price')}
                required
              />
            </div>
            <div>
              <label className={label}>Stock quantity</label>
              <input
                type="number"
                min="0"
                className={field}
                value={form.stock}
                onChange={set('stock')}
              />
            </div>
            <div>
              <label className={label}>Category</label>
              <select className={field} value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Location</label>
              <select className={field} value={form.location} onChange={set('location')}>
                {LOCATIONS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className={card}>
          <h2 className={title}>Contact & delivery</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Contact phone</label>
              <input className={field} value={form.contact} onChange={set('contact')} />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Delivery information</label>
              <textarea
                className={`${field} min-h-[80px] resize-y`}
                value={form.deliveryInfo}
                onChange={set('deliveryInfo')}
              />
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3 pb-8">
          <Link
            to={`/products/${id}`}
            className="btn-action rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="btn-action rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-700 disabled:opacity-60"
          >
            {submitting ? (uploading ? `Uploading ${progress}%…` : 'Saving…') : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
