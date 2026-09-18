import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { productBySlug } from '../data/catalog'

const StoreCtx = createContext(null)

const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ }
}

const lineId = (slug, variant) => `${slug}::${variant || ''}`

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => read('bmp.cart', []).filter((l) => productBySlug[l.slug]))
  const [wishlist, setWishlist] = useState(() => read('bmp.wishlist', []).filter((s) => productBySlug[s]))
  const [panel, setPanel] = useState(null) // 'cart' | 'search' | 'menu' | null
  const [quickView, setQuickView] = useState(null)
  const [bump, setBump] = useState(0)

  useEffect(() => write('bmp.cart', cart), [cart])
  useEffect(() => write('bmp.wishlist', wishlist), [wishlist])

  const addToCart = useCallback((slug, variant = null, qty = 1) => {
    setCart((c) => {
      const id = lineId(slug, variant)
      const hit = c.find((l) => l.id === id)
      if (hit) return c.map((l) => (l.id === id ? { ...l, qty: Math.min(l.qty + qty, 20) } : l))
      return [...c, { id, slug, variant, qty }]
    })
    setBump((b) => b + 1)
  }, [])

  const setQty = useCallback((id, qty) => {
    setCart((c) => (qty <= 0 ? c.filter((l) => l.id !== id) : c.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 20) } : l))))
  }, [])

  const removeLine = useCallback((id) => setCart((c) => c.filter((l) => l.id !== id)), [])
  const clearCart = useCallback(() => setCart([]), [])

  const toggleWish = useCallback((slug) => {
    setWishlist((w) => (w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug]))
  }, [])

  const lines = useMemo(
    () => cart.map((l) => ({ ...l, product: productBySlug[l.slug] })).filter((l) => l.product),
    [cart],
  )
  const count = lines.reduce((n, l) => n + l.qty, 0)
  const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0)

  const value = {
    lines, count, subtotal, bump,
    addToCart, setQty, removeLine, clearCart,
    wishlist, toggleWish, isWished: (s) => wishlist.includes(s),
    panel, openPanel: setPanel, closePanel: () => setPanel(null),
    quickView, openQuickView: setQuickView, closeQuickView: () => setQuickView(null),
  }
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export const useStore = () => useContext(StoreCtx)
