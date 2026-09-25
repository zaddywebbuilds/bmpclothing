// Emits one index.html per route (route-specific title/description/canonical/og:image, and static
// Product JSON-LD on product pages) so GitHub Pages serves deep links directly and crawlers see
// real metadata without running JS. Also writes 404.html, an image sitemap and robots.txt.
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
const img = (id, max = 960) => {
  const ws = catalog.media[id].widths
  return `${SITE}/assets/bmp/${id}-${[...ws].reverse().find((w) => w <= max) || ws[0]}.webp`
}
const catName = Object.fromEntries(catalog.categories.map((c) => [c.key, c.name]))

// [path, title, description, noindex, ogImage, jsonLd, sitemapImages]
const routes = [
  ['/shop', "Shop Women's Fashion", 'Every BMP Clothings piece in one place: statement long gowns, short gowns, jumpsuits and coordinated sets from Lagos, in UK sizes 8–22 with clear Naira prices.'],
  ['/new-in', 'New In', 'The newest pieces from the BMP Clothings store in Lagos. Statement gowns, minis and jumpsuits, just arrived.'],
  ['/lookbook', 'Lookbook', 'The BMP Clothings lookbook: gold hour, red alert, soft power, blue mood and colour theory. Shop every look.'],
  ['/the-bmp-woman', 'The BMP Woman', 'If you see BMP Woman, you go know. Meet the confident, expressive Lagos woman behind every BMP piece.'],
  ['/about', 'About BMP', 'The story behind BMP Clothings, a Lagos women’s fashion house built on quality you can see and style you can feel.'],
  ['/contact', 'Contact', 'Contact BMP Clothings in Lagos on WhatsApp 0901 962 4520 for orders, sizing, delivery and product questions.'],
  ['/faq', 'FAQ', 'Answers about ordering, payment, delivery and returns at BMP Clothings.'],
  ['/shipping', 'Shipping', 'BMP Clothings shipping: order processing, delivery time, charges and tracking.'],
  ['/size-guide', 'Size Guide & Find My Size', 'BMP Clothings size guide: UK sizes 8 to 22 with bust, waist and hip in inches and cm. Enter your measurements to find your BMP size instantly.'],
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
  const url = `${SITE}/product/${p.slug}`
  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'Product', name: p.title, sku: p.sku || p.slug,
      brand: { '@type': 'Brand', name: 'BMP Clothings' }, description: p.description, category: catName[p.category],
      image: p.images.map((id) => img(id)),
      ...(p.colours.length ? { color: p.colours.map((c) => c.name).join(', ') } : {}),
      offers: {
        '@type': 'Offer', priceCurrency: 'NGN', price: p.price, url,
        ...(p.inStock ? { availability: 'https://schema.org/InStock' } : {}),
        seller: { '@type': 'Organization', name: 'BMP Clothings' },
      },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [['Home', '/'], ['Shop', '/shop'], [catName[p.category], `/collections/${p.category}`], [p.title, `/product/${p.slug}`]]
        .map(([name, u], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE}${u}` })),
    },
  ]
  routes.push([`/product/${p.slug}`, title, desc, false, img(p.images[0]), ld, p.images.map((id) => img(id, 1800))])
}

const render = (path, title, desc, noindex, image, ld) => {
  const full = `${esc(title)} | BMP Clothings`
  let h = shell
    .replace(/\s*<link rel="preload" as="image"[^>]*>/, '')
    .replace(/<title>.*?<\/title>/, `<title>${full}</title>`)
    .replace(/(<meta name="description" content=")[^"]*"/, `$1${esc(desc)}"`)
    .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${SITE}${path}"`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${full}"`)
    .replace(/(<meta property="og:description" content=")[^"]*"/, `$1${esc(desc)}"`)
    .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${SITE}${path}"`)
  if (image) h = h.replace(/(<meta property="og:image" content=")[^"]*"/, `$1${image}"`)
  if (noindex) h = h.replace('</head>', '    <meta name="robots" content="noindex" />\n  </head>')
  if (ld) h = h.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>\n  </head>`)
  return h
}

for (const [path, title, desc, noindex, image, ld] of routes) {
  const file = join(dist, path, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, render(path, title, desc, noindex, image, ld))
}
writeFileSync(join(dist, '404.html'), render('/404', 'Page not found', 'This page could not be found.', true))

const indexed = [['/'], ...routes.filter((r) => !r[3])]
const entry = (r) =>
  `  <url><loc>${SITE}${r[0]}</loc>${(r[6] || []).map((i) => `<image:image><image:loc>${i}</image:loc></image:image>`).join('')}</url>`
writeFileSync(join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${indexed.map(entry).join('\n')}\n</urlset>\n`)
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)
writeFileSync(join(dist, '.nojekyll'), '')
console.log(`postbuild: ${routes.length} route pages, 404.html, sitemap (${indexed.length} urls)`)
