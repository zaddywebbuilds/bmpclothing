import data from './catalog.json'

export const media = data.media

// URL of the largest generated width not exceeding `max` (relative to the site root).
export const imagePath = (id, max = 960) => {
  const ws = media[id]?.widths || []
  const w = [...ws].reverse().find((x) => x <= max) || ws[0]
  return `assets/bmp/${id}-${w}.webp`
}
export const categories = data.categories
export const occasions = data.occasions

export const products = data.products.map((p, i) => ({
  ...p,
  order: i,
  name: p.title,
  url: `/product/${p.slug}`,
}))

export const productBySlug = Object.fromEntries(products.map((p) => [p.slug, p]))
export const categoryByKey = Object.fromEntries(categories.map((c) => [c.key, c]))
export const occasionByKey = Object.fromEntries(occasions.map((o) => [o.key, o]))

export const inCategory = (key) => products.filter((p) => p.category === key)
export const forOccasion = (key) => products.filter((p) => p.occasions?.includes(key))

export const newIn = products.filter((p) => p.newIn)
export const picks = products.filter((p) => p.pick)
export const worn = products.filter((p) => p.worn)

export const pick = (...slugs) => slugs.map((s) => productBySlug[s]).filter(Boolean)

export const altText = (p, i = 0) =>
  p.worn
    ? `BMP customer wearing the ${p.title}${p.code ? ` (${p.code})` : ''}`
    : `${p.title}${p.code ? ` (${p.code})` : ''} by BMP Clothings${i ? `, view ${i + 1}` : ''}`

export const priceRange = () => {
  const ps = products.map((p) => p.price)
  return [Math.min(...ps), Math.max(...ps)]
}
