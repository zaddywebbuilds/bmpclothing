import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { productBySlug } from '../data/catalog'
import { newOrderRef } from './order'
import { asItem, track } from './analytics'
import { site } from '../data/site'

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
  const [orders, setOrders] = useState(() => read('bmp.orders', []))
  const [restocks, setRestocks] = useState(() => read('bmp.restocks', []))
  const [panel, setPanel] = useState(null) // 'cart' | 'search' | 'menu' | null
  const [quickView, setQuickView] = useState(null)
  const [bump, setBump] = useState(0)

  useEffect(() => write('bmp.cart', cart), [cart])
  useEffect(() => write('bmp.wishlist', wishlist), [wishlist])
  useEffect(() => write('bmp.orders', orders), [orders])
  useEffect(() => write('bmp.restocks', restocks), [restocks])

  const addToCart = useCallback((slug, variant = null, qty = 1) => {
    setCart((c) => {
      const id = lineId(slug, variant)
      const hit = c.find((l) => l.id === id)
      if (hit) return c.map((l) => (l.id === id ? { ...l, qty: Math.min(l.qty + qty, 20) } : l))
      return [...c, { id, slug, variant, qty }]
    })
    setBump((b) => b + 1)
    const p = productBySlug[slug]
    if (p) track('add_to_cart', { value: p.price * qty, items: [asItem(p, { variant, qty })] })
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

  // Regenerates whenever the bag changes, so the reference in the WhatsApp link
  // always matches what is being checked out.
  const checkoutRef = useMemo(() => newOrderRef(), [cart])

  // Called as the shopper hands off to WhatsApp. Keeps a copy on their device and,
  // when a webhook is configured, sends one to the shop.
  const recordOrder = useCallback((orderLines, total, ref) => {
    const order = {
      ref,
      at: new Date().toISOString(),
      subtotal: total,
      items: orderLines.map((l) => ({
        slug: l.slug,
        title: l.product.title,
        code: l.product.code || null,
        variant: l.variant || null,
        qty: l.qty,
        price: l.product.price,
      })),
    }
    setOrders((o) => [order, ...o].slice(0, 50))
    track('begin_checkout', {
      value: total,
      items: orderLines.map((l) => asItem(l.product, { variant: l.variant, qty: l.qty })),
    })
    if (site.orderWebhook) {
      fetch(site.orderWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
        keepalive: true,
      }).catch(() => { /* the WhatsApp handoff still goes through */ })
    }
    return order
  }, [])

  // Marks the piece as asked-about on this device so the card can show it, and posts to
  // the webhook when one is set. The WhatsApp handoff is what actually reaches the shop.
  const recordRestock = useCallback((slug, ref) => {
    const p = productBySlug[slug]
    if (!p) return null
    const request = {
      ref,
      at: new Date().toISOString(),
      slug,
      title: p.title,
      code: p.code || null,
      price: p.price,
    }
    setRestocks((r) => [request, ...r.filter((x) => x.slug !== slug)].slice(0, 50))
    track('restock_request', { value: p.price, items: [asItem(p)] })
    if (site.orderWebhook) {
      fetch(site.orderWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'restock', ...request }),
        keepalive: true,
      }).catch(() => { /* the WhatsApp handoff still goes through */ })
    }
    return request
  }, [])

  const value = {
    lines, count, subtotal, bump,
    addToCart, setQty, removeLine, clearCart,
    orders, recordOrder, checkoutRef,
    restocks, recordRestock, hasAskedRestock: (s) => restocks.some((r) => r.slug === s),
    wishlist, toggleWish, isWished: (s) => wishlist.includes(s),
    panel, openPanel: setPanel, closePanel: () => setPanel(null),
    quickView, openQuickView: setQuickView, closeQuickView: () => setQuickView(null),
  }
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export const useStore = () => useContext(StoreCtx)
