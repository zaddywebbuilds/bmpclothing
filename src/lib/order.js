import { site, waLink } from '../data/site'
import { naira } from './util'

const RULE = '──────────────────'
const FOOTER = `${RULE}\nMy name:\n📍 Delivery address:\n💳 Payment method:\n${RULE}\n\nPlease confirm availability. Thank you!`

const shortDescription = (p) => p.description.split(/(?<=\.)\s/)[0]
const pageUrl = (p) => `${site.url}/product/${p.slug}`

// Single-piece order message, same format as the Banglog site.
export const productMessage = (p, { variant, qty = 1 } = {}) =>
  `Hello BMP Clothings 👋\n\n` +
  `I would like to order:\n\n` +
  `👗 *${p.title}*${p.code ? ` (${p.code})` : ''}\n` +
  `💰 Price: ${naira(p.price)}\n` +
  (variant ? `🎨 Option: ${variant}\n` : '') +
  `📦 Qty: ${qty}\n` +
  `📝 ${shortDescription(p)}\n` +
  `🔗 ${pageUrl(p)}\n\n` +
  FOOTER

export const orderLink = (p, opts) => waLink(productMessage(p, opts))

export const checkoutMessage = (lines, subtotal) => {
  const items = lines
    .map((l) => `👗 *${l.product.title}*${l.product.code ? ` (${l.product.code})` : ''}${l.variant ? ` · ${l.variant}` : ''} × ${l.qty}  ${naira(l.product.price * l.qty)}`)
    .join('\n')
  return `Hello BMP Clothings 👋\n\nI would like to order:\n\n${items}\n\n💰 Subtotal: ${naira(subtotal)}\n\n${FOOTER}`
}

export const checkoutLink = (lines, subtotal) => waLink(checkoutMessage(lines, subtotal))

export const enquiryLink = (p, variant) =>
  waLink(`Hi BMP Clothings 👋\n\nI would like to know more about *${p.title}*${p.code ? ` (${p.code})` : ''}${variant ? ` in ${variant}` : ''} (${naira(p.price)}).\n\n${pageUrl(p)}`)
