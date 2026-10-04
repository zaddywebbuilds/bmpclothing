import { site, waLink } from '../data/site'
import { naira } from './util'

const RULE = '──────────────────'
const FOOTER = `${RULE}\nMy name:\n📍 Delivery address:\n💳 Payment method:\n${RULE}\n\nPlease confirm availability. Thank you!`

// The order line opens with an icon matching the piece, so a wig or bag does not arrive
// in the owner's WhatsApp labelled with a dress.
const CATEGORY_ICON = { hair: '💇🏽‍♀️', bags: '👜' }
const icon = (p) => CATEGORY_ICON[p.category] || '👗'

const shortDescription = (p) => p.description.split(/(?<=\.)\s/)[0]
const pageUrl = (p) => `${site.url}/product/${p.slug}`

// No vowels or look-alike characters, so a reference read aloud over the phone survives.
const ALPHABET = '23456789ACDEFGHJKLMNPQRTUVWXYZ'

export const newOrderRef = () => {
  const bytes = new Uint8Array(5)
  crypto.getRandomValues(bytes)
  return `BMP-${Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('')}`
}

const refLine = (ref) => (ref ? `🧾 Ref: ${ref}\n` : '')

// Single-piece order message, same format as the Banglog site.
export const productMessage = (p, { variant, qty = 1, ref } = {}) =>
  `Hello BMP Collections 👋\n\n` +
  `I would like to order:\n\n` +
  `${icon(p)} *${p.title}*${p.code ? ` (${p.code})` : ''}\n` +
  `💰 Price: ${naira(p.price)}\n` +
  (variant ? `🎨 Option: ${variant}\n` : '') +
  `📦 Qty: ${qty}\n` +
  `📝 ${shortDescription(p)}\n` +
  `🔗 ${pageUrl(p)}\n\n` +
  refLine(ref) +
  FOOTER

export const orderLink = (p, opts) => waLink(productMessage(p, opts))

export const checkoutMessage = (lines, subtotal, ref) => {
  const items = lines
    .map((l) => `${icon(l.product)} *${l.product.title}*${l.product.code ? ` (${l.product.code})` : ''}${l.variant ? ` · ${l.variant}` : ''} × ${l.qty}  ${naira(l.product.price * l.qty)}`)
    .join('\n')
  return `Hello BMP Collections 👋\n\nI would like to order:\n\n${items}\n\n💰 Subtotal: ${naira(subtotal)}\n${refLine(ref)}\n${FOOTER}`
}

export const checkoutLink = (lines, subtotal, ref) => waLink(checkoutMessage(lines, subtotal, ref))

export const enquiryLink = (p, variant) =>
  waLink(`Hi BMP Collections 👋\n\nI would like to know more about *${p.title}*${p.code ? ` (${p.code})` : ''}${variant ? ` in ${variant}` : ''} (${naira(p.price)}).\n\n${pageUrl(p)}`)

// Structured like the order message so the admin portal can parse a pasted restock
// request and build a waiting list per piece. The shopper's number comes with the
// WhatsApp message itself, so the form never asks for it.
export const restockMessage = (p, ref) =>
  `Hi BMP Collections 👋\n\n` +
  `Please let me know when this is back in stock:\n\n` +
  `${icon(p)} *${p.title}*${p.code ? ` (${p.code})` : ''}\n` +
  `💰 Price: ${naira(p.price)}\n` +
  `🔗 ${pageUrl(p)}\n\n` +
  (ref ? `🧾 Restock ref: ${ref}\n\n` : '') +
  `${RULE}\nMy name:\n${RULE}\n\nThank you!`

export const restockLink = (p, ref) => waLink(restockMessage(p, ref))
