import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ─── Mock seed data (matches Biashara HUB screenshots) ───────────────────────
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Kitenge Ankara Maxi Dress',
    sku: 'KIT-001-BLU',
    category: 'Clothing',
    price: 85000,
    currency: 'TZS',
    stock: 142,
    stockStatus: 'in_stock',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=160&h=160&fit=crop&auto=format',
    location: 'Dar es Salaam',
    lastUpdated: '2 hrs ago',
    description:
      'Elegant hand-dyed Kitenge Ankara maxi dress with vibrant East African patterns. Perfect for formal occasions and cultural celebrations.',
    contact: '+255 712 345 678',
    deliveryInfo: 'Nationwide delivery in 3–5 business days. Free shipping over TZS 100,000.',
    media: [],
  },
  {
    id: '2',
    name: 'Handcrafted Maasai Sandals',
    sku: 'MAS-002-BRN',
    category: 'Footwear',
    price: 45000,
    currency: 'TZS',
    stock: 8,
    stockStatus: 'low_stock',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=160&h=160&fit=crop&auto=format',
    location: 'Arusha',
    lastUpdated: '5 hrs ago',
    description: 'Authentic Maasai beaded leather sandals, handcrafted by artisans in Arusha.',
    contact: '+255 754 221 100',
    deliveryInfo: 'Ships from Arusha. 2–4 days to major cities.',
    media: [],
  },
  {
    id: '3',
    name: 'Organic Moringa Powder 500g',
    sku: 'MOR-003-GRN',
    category: 'Health & Beauty',
    price: 22000,
    currency: 'TZS',
    stock: 0,
    stockStatus: 'out_of_stock',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=160&h=160&fit=crop&auto=format',
    location: 'Moshi',
    lastUpdated: '1 day ago',
    description: 'Pure organic moringa leaf powder from Kilimanjaro region. Rich in vitamins and antioxidants.',
    contact: '+255 768 990 112',
    deliveryInfo: 'Restock expected soon. Pre-order available.',
    media: [],
  },
  {
    id: '4',
    name: 'Zanzibar Spice Gift Set',
    sku: 'ZNZ-004-SPX',
    category: 'Food & Gifts',
    price: 35000,
    currency: 'TZS',
    stock: 56,
    stockStatus: 'in_stock',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=160&h=160&fit=crop&auto=format',
    location: 'Zanzibar',
    lastUpdated: '3 hrs ago',
    description: 'Curated gift box of cloves, cinnamon, cardamom and black pepper from Zanzibar spice farms.',
    contact: '+255 777 333 444',
    deliveryInfo: 'Island to mainland shipping 1–3 days.',
    media: [],
  },
  {
    id: '5',
    name: 'Premium Safari Backpack 40L',
    sku: 'SAF-005-KHK',
    category: 'Bags & Travel',
    price: 185000,
    currency: 'TZS',
    stock: 4,
    stockStatus: 'low_stock',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=160&h=160&fit=crop&auto=format',
    location: 'Dar es Salaam',
    lastUpdated: '6 hrs ago',
    description: 'Durable 40L safari backpack with rain cover, ideal for safari and hiking across Tanzania.',
    contact: '+255 713 888 999',
    deliveryInfo: 'Express delivery available in Dar es Salaam.',
    media: [],
  },
  {
    id: '6',
    name: 'Sisal Woven Market Basket',
    sku: 'SIS-006-NAT',
    category: 'Home & Decor',
    price: 28000,
    currency: 'TZS',
    stock: 91,
    stockStatus: 'in_stock',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1585155770486-55c2c9a3d0e5?w=160&h=160&fit=crop&auto=format',
    location: 'Dodoma',
    lastUpdated: '12 hrs ago',
    description: 'Handwoven sisal basket from central Tanzania. Perfect for market shopping or home storage.',
    contact: '+255 765 111 222',
    deliveryInfo: 'Bulk orders welcome.',
    media: [],
  },
  {
    id: '7',
    name: 'Tanzanite Crystal Pendant',
    sku: 'TAN-007-PRP',
    category: 'Jewelry',
    price: 520000,
    currency: 'TZS',
    stock: 12,
    stockStatus: 'in_stock',
    status: 'draft',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=160&h=160&fit=crop&auto=format',
    location: 'Arusha',
    lastUpdated: '2 days ago',
    description: 'Genuine Tanzanite pendant set in sterling silver. Certificate of authenticity included.',
    contact: '+255 754 000 111',
    deliveryInfo: 'Insured shipping only.',
    media: [],
  },
  {
    id: '8',
    name: 'Hand-Painted Tinga Tinga Art',
    sku: 'TNG-008-ART',
    category: 'Art & Crafts',
    price: 120000,
    currency: 'TZS',
    stock: 6,
    stockStatus: 'low_stock',
    status: 'draft',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=160&h=160&fit=crop&auto=format',
    location: 'Dar es Salaam',
    lastUpdated: '1 day ago',
    description: 'Original Tinga Tinga style acrylic painting on canvas. Wildlife theme.',
    contact: '+255 712 555 666',
    deliveryInfo: 'Carefully packaged for art shipping.',
    media: [],
  },
  {
    id: '9',
    name: 'Shea Butter Body Cream 250ml',
    sku: 'SHA-009-CRM',
    category: 'Health & Beauty',
    price: 18000,
    currency: 'TZS',
    stock: 203,
    stockStatus: 'in_stock',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=160&h=160&fit=crop&auto=format',
    location: 'Mwanza',
    lastUpdated: '4 hrs ago',
    description: 'Natural shea butter body cream enriched with coconut oil. Suitable for all skin types.',
    contact: '+255 756 777 888',
    deliveryInfo: 'Fast shipping from Lake Zone.',
    media: [],
  },
  {
    id: '10',
    name: 'Vintage Kanga Wrap Fabric',
    sku: 'KNG-010-VNT',
    category: 'Clothing',
    price: 15000,
    currency: 'TZS',
    stock: 0,
    stockStatus: 'out_of_stock',
    status: 'archived',
    image: 'https://images.unsplash.com/photo-1558171813-4c0880c82f6d?w=160&h=160&fit=crop&auto=format',
    location: 'Dar es Salaam',
    lastUpdated: '5 days ago',
    description: 'Traditional Tanzanian kanga with classic proverbs. Soft cotton, 1.5m x 1m.',
    contact: '+255 713 222 333',
    deliveryInfo: 'Currently archived — contact for restock.',
    media: [],
  },
]

// In-memory store so create/edit/delete work offline
let store = JSON.parse(JSON.stringify(MOCK_PRODUCTS))

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

function deriveStockStatus(stock) {
  if (stock <= 0) return 'out_of_stock'
  if (stock <= 10) return 'low_stock'
  return 'in_stock'
}

function formatRelative(date = new Date()) {
  return 'just now'
}

// ─── Public API (tries real backend, falls back to mock) ─────────────────────

export async function getProducts(params = {}) {
  try {
    const { data } = await api.get('/products', { params })
    return Array.isArray(data) ? data : data.results || data.data || []
  } catch {
    await delay()
    let list = [...store]
    if (params.status && params.status !== 'all') {
      list = list.filter((p) => p.status === params.status)
    }
    if (params.category && params.category !== 'All Categories') {
      list = list.filter((p) => p.category === params.category)
    }
    if (params.location && params.location !== 'All Locations') {
      list = list.filter((p) => p.location === params.location)
    }
    if (params.search) {
      const q = String(params.search).toLowerCase()
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      )
    }
    return list
  }
}

export async function getProduct(id) {
  try {
    const { data } = await api.get(`/products/${id}`)
    return data
  } catch {
    await delay(300)
    const found = store.find((p) => String(p.id) === String(id))
    if (!found) throw new Error('Product not found')
    return { ...found }
  }
}

export async function createProduct(payload) {
  try {
    const { data } = await api.post('/products', payload)
    return data
  } catch {
    await delay(500)
    const id = String(Date.now())
    const product = {
      id,
      name: payload.name,
      sku: payload.sku || `SKU-${id.slice(-6)}`,
      category: payload.category || 'Other',
      price: Number(payload.price) || 0,
      currency: payload.currency || 'TZS',
      stock: Number(payload.stock) || 0,
      stockStatus: deriveStockStatus(Number(payload.stock) || 0),
      status: payload.status || 'active',
      image:
        payload.image ||
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=160&h=160&fit=crop&auto=format',
      location: payload.location || 'Dar es Salaam',
      lastUpdated: formatRelative(),
      description: payload.description || '',
      contact: payload.contact || '',
      deliveryInfo: payload.deliveryInfo || '',
      media: payload.media || [],
    }
    store = [product, ...store]
    return product
  }
}

export async function updateProduct(id, payload) {
  try {
    const { data } = await api.put(`/products/${id}`, payload)
    return data
  } catch {
    await delay(500)
    const idx = store.findIndex((p) => String(p.id) === String(id))
    if (idx === -1) throw new Error('Product not found')
    const stock = payload.stock !== undefined ? Number(payload.stock) : store[idx].stock
    const updated = {
      ...store[idx],
      ...payload,
      stock,
      stockStatus: deriveStockStatus(stock),
      lastUpdated: formatRelative(),
    }
    store[idx] = updated
    return { ...updated }
  }
}

export async function deleteProduct(id) {
  try {
    await api.delete(`/products/${id}`)
    return { success: true }
  } catch {
    await delay(400)
    store = store.filter((p) => String(p.id) !== String(id))
    return { success: true }
  }
}

export async function uploadProductMedia(productId, file, onProgress) {
  try {
    const form = new FormData()
    form.append('file', file)
    const { data } = await api.post(`/products/${productId}/media`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total))
      },
    })
    return data
  } catch {
    // Simulate upload progress for offline demo
    return new Promise((resolve) => {
      let p = 0
      const tick = () => {
        p += 8 + Math.random() * 12
        if (p >= 100) {
          onProgress?.(100)
          const media = {
            id: `m-${Date.now()}`,
            url: URL.createObjectURL(file),
            name: file.name,
            type: file.type,
          }
          const idx = store.findIndex((x) => String(x.id) === String(productId))
          if (idx !== -1) {
            store[idx].media = [...(store[idx].media || []), media]
            if (!store[idx].image || store[idx].image.includes('unsplash')) {
              store[idx].image = media.url
            }
          }
          resolve(media)
        } else {
          onProgress?.(Math.min(99, Math.round(p)))
          setTimeout(tick, 80)
        }
      }
      tick()
    })
  }
}

export async function deleteProductMedia(productId, mediaId) {
  try {
    await api.delete(`/products/${productId}/media/${mediaId}`)
    return { success: true }
  } catch {
    await delay(300)
    const idx = store.findIndex((p) => String(p.id) === String(productId))
    if (idx !== -1) {
      store[idx].media = (store[idx].media || []).filter((m) => m.id !== mediaId)
    }
    return { success: true }
  }
}

export const CATEGORIES = [
  'Clothing',
  'Footwear',
  'Health & Beauty',
  'Food & Gifts',
  'Bags & Travel',
  'Home & Decor',
  'Jewelry',
  'Art & Crafts',
]

export const LOCATIONS = [
  'Dar es Salaam',
  'Arusha',
  'Moshi',
  'Zanzibar',
  'Dodoma',
  'Mwanza',
]

export function formatTZS(amount) {
  return `TZS ${Number(amount || 0).toLocaleString('en-TZ')}`
}

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductMedia,
  deleteProductMedia,
  CATEGORIES,
  LOCATIONS,
  formatTZS,
}