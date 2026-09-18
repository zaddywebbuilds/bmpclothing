// Emits one index.html per route (with route-specific title/description/canonical/og:image)
// so GitHub Pages serves deep links directly, plus 404.html, sitemap.xml and robots.txt.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const SITE = 'https://zaddywebbuilds.github.io/bmpclothing'
const catalog = JSON.parse(readFileSync(join(root, 'src/data/catalog.json'), 'utf8'))
const shell = readFileSync(join(dist, 'index.html'), 'utf8')

const naira = (n) => `₦${n.toLocaleString('en-NG')}`
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const img = (id) => {
  const ws = catalog.media[id].widths
  return `${SITE}/assets/bmp/${id}-${[...ws].reverse().find((w) => w <= 960) || ws[0]}.webp`
}

const routes = [
  ['/shop', "Shop Women's Fashion", 'Every BMP Clothings piece in one place: long gowns, short gowns, jumpsuits, tops and sets from Lagos with clear Naira prices.'],
  ['/new-in', 'New In', 'The newest pieces from the BMP Clothings store in Lagos. Statement gowns, minis and jumpsuits, just arrived.'],
  ['/lookbook', 'Lookbook', 'The BMP Clothings lookbook: gold hour, red alert, soft power, blue mood and colour theory. Shop every look.'],
  ['/the-bmp-woman', 'The BMP Woman', 'If you see BMP Woman, you go know. Meet the confident, expressive Lagos woman behind every BMP piece.'],
  ['/about', 'About BMP', 'The story behind BMP Clothings, a Lagos women’s fashion house built on quality you can see and style you can feel.'],
  ['/contact', 'Contact', 'Contact BMP Clothings in Lagos on WhatsApp 0901 962 4520 for orders, sizing, delivery and product questions.'],
  ['/faq', 'FAQ', 'Answers about ordering, payment, delivery and returns at BMP Clothings.'],
  ['/shipping', 'Shipping', 'BMP Clothings shipping: order processing, delivery time, charges and tracking.'],
  ['/returns', 'Returns & Exchanges', 'BMP Clothings returns and exchanges: eligibility, item condition and how to request a return.'],
  ['/bag', 'Your Bag', 'Your BMP Clothings shopping bag.', true],
  ['/wishlist', 'Wishlist', 'Your saved BMP Clothings pieces.', true],
]
for (const c of catalog.categories.filter((c) => c.count)) {
  routes.push([`/collections/${c.key}`, c.name, `${c.blurb} Shop ${c.count} ${c.name.toLowerCase()} from BMP Clothings, Lagos.`])
}
for (const o of catalog.occasions) {
  routes.push([`/occasion/${o.key}`, o.name, `${o.line} BMP Clothings pieces styled for ${o.name.toLowerCase()}.`])
}
for (const p of catalog.products) {
  const title = `${p.title}${p.code ? ` (${p.code})` : ''}`
  const desc = `${p.description.slice(0, 150).replace(/\s\S*$/, '')}… ${naira(p.price)} at BMP Clothings, Lagos.`
  routes.push([`/product/${p.slug}`, title, desc, false, img(p.images[0])])
}

const render = (path, title, desc, noindex, image) => {
  const full = `${esc(title)} | BMP Clothings`
  let h = shell.replace(/\s*<link rel="preload" as="image"[^>]*>/, '')
    .replace(/<title>.*?<\/title>/, `<title>${full}</title>`)
    .replace(/(<meta name="description" content=")[^"]*"/, `$1${esc(desc)}"`)
    .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${SITE}${path}"`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${full}"`)
    .replace(/(<meta property="og:description" content=")[^"]*"/, `$1${esc(desc)}"`)
    .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${SITE}${path}"`)
  if (image) h = h.replace(/(<meta property="og:image" content=")[^"]*"/, `$1${image}"`)
  if (noindex) h = h.replace('</head>', '    <meta name="robots" content="noindex" />\n  </head>')
  return h
}

for (const [path, title, desc, noindex, image] of routes) {
  const file = join(dist, path, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, render(path, title, desc, noindex, image))
}
writeFileSync(join(dist, '404.html'), render('/404', 'Page not found', 'This page could not be found.', true))

const urls = ['/', ...routes.filter((r) => !r[3]).map((r) => r[0])]
writeFileSync(join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE}${u === '/' ? '/' : u}</loc></url>`).join('\n')}\n</urlset>\n`)
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)
writeFileSync(join(dist, '.nojekyll'), '')
console.log(`postbuild: ${routes.length} route pages, 404.html, sitemap (${urls.length} urls)`)
