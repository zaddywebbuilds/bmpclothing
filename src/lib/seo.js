import { useEffect } from 'react'
import { site } from '../data/site'
import { priceRange } from '../data/catalog'

const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

const setLink = (rel, href) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

export function useSeo({ title, description, path = '', image, imageAlt, type = 'website', jsonLd }) {
  useEffect(() => {
    const full = title ? `${title} | BMP Clothings` : "BMP Clothings | Women's Fashion, Dresses & Statement Styles"
    document.title = full
    const url = `${site.url}${path}`
    const img = image ? `${site.url}/${image}` : `${site.url}/assets/bmp/brand/og-image.jpg`

    if (description) {
      setMeta('name', 'description', description)
      setMeta('property', 'og:description', description)
      setMeta('name', 'twitter:description', description)
    }
    setMeta('property', 'og:title', full)
    setMeta('name', 'twitter:title', full)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', img)
    setMeta('property', 'og:image:alt', imageAlt || `${title || site.name} — BMP Clothings, Lagos`)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:site_name', site.name)
    setMeta('property', 'og:locale', 'en_NG')
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:image', img)
    setMeta('name', 'twitter:image:alt', imageAlt || `${title || site.name} — BMP Clothings, Lagos`)
    // let search engines use full-size imagery and longer snippets for the catalogue
    setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    setMeta('name', 'geo.region', 'NG-LA')
    setMeta('name', 'geo.placename', 'Lagos')

    setLink('canonical', url)

    document.head.querySelectorAll('script[data-seo]').forEach((s) => s.remove())
    const blocks = [organizationLd(), webSiteLd(), ...(jsonLd ? [].concat(jsonLd) : [])]
    blocks.forEach((b) => {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.dataset.seo = ''
      s.textContent = JSON.stringify(b)
      document.head.appendChild(s)
    })
  }, [title, description, path, image, imageAlt, type, jsonLd])
}

const naira = (n) => `₦${n.toLocaleString('en-NG')}`

const organizationLd = () => {
  const [low, high] = priceRange()
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    '@id': `${site.url}/#store`,
    name: site.name,
    url: site.url,
    logo: `${site.url}/assets/bmp/brand/og-image.jpg`,
    image: `${site.url}/assets/bmp/brand/og-image.jpg`,
    description:
      'BMP Clothings is a Lagos women’s fashion house selling statement long gowns, short gowns, jumpsuits and coordinated sets, with clear Naira prices and ordering on WhatsApp.',
    address: { '@type': 'PostalAddress', addressLocality: 'Lagos', addressRegion: 'Lagos', addressCountry: 'NG' },
    areaServed: { '@type': 'Country', name: 'Nigeria' },
    telephone: `+${site.whatsapp.number}`,
    priceRange: `${naira(low)} - ${naira(high)}`,
    currenciesAccepted: 'NGN',
    paymentAccepted: 'Bank transfer, Cash',
    knowsLanguage: 'en',
    sameAs: [site.facebook, site.instagram, site.tiktok].filter(Boolean),
  }
}

const webSiteLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${site.url}/#website`,
  url: site.url,
  name: site.name,
  inLanguage: 'en-NG',
  publisher: { '@id': `${site.url}/#store` },
})

export const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({
    '@type': 'ListItem', position: i + 1, name, item: `${site.url}${path}`,
  })),
})
