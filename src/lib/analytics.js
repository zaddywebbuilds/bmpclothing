import { site } from '../data/site'

// Nothing loads and no cookies are set until an ID is filled in at site.analytics.
const cfg = site.analytics || {}
let started = false

const inject = (src) => {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  document.head.appendChild(s)
}

const startGa4 = (id) => {
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', id, { send_page_view: false })
  inject(`https://www.googletagmanager.com/gtag/js?id=${id}`)
}

const startPixel = (id) => {
  const fbq = function () {
    fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments)
  }
  fbq.queue = []
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.push = fbq
  window.fbq = window._fbq = fbq
  inject('https://connect.facebook.net/en_US/fbevents.js')
  window.fbq('init', id)
}

export function initAnalytics() {
  if (started) return
  started = true
  if (cfg.ga4) startGa4(cfg.ga4)
  if (cfg.metaPixel) startPixel(cfg.metaPixel)
}

// GA4 event name -> Meta Pixel standard event name.
const PIXEL_EVENT = {
  view_item: 'ViewContent',
  add_to_cart: 'AddToCart',
  add_to_wishlist: 'AddToWishlist',
  begin_checkout: 'InitiateCheckout',
  search: 'Search',
}

export function track(event, params = {}) {
  window.gtag?.('event', event, { currency: 'NGN', ...params })
  const pixel = PIXEL_EVENT[event]
  if (pixel) {
    window.fbq?.('track', pixel, {
      currency: 'NGN',
      value: params.value,
      content_type: 'product',
      content_ids: (params.items || []).map((i) => i.item_id),
      contents: (params.items || []).map((i) => ({ id: i.item_id, quantity: i.quantity || 1 })),
    })
  }
}

export function pageView(path, title) {
  window.gtag?.('event', 'page_view', { page_path: path, page_title: title || document.title })
  window.fbq?.('track', 'PageView')
}

// Shape a catalog product the way GA4 expects an item.
export const asItem = (p, { variant, qty = 1 } = {}) => ({
  item_id: p.code || p.slug,
  item_name: p.title,
  item_category: p.category,
  item_variant: variant || undefined,
  price: p.price,
  quantity: qty,
})
