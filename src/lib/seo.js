import { useEffect } from 'react'
import { site } from '../data/site'

const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function useSeo({ title, description, path = '', image, jsonLd }) {
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
    setMeta('name', 'twitter:image', img)
    let canon = document.head.querySelector('link[rel="canonical"]')
    if (!canon) {
      canon = document.createElement('link')
      canon.rel = 'canonical'
      document.head.appendChild(canon)
    }
    canon.href = url

    document.head.querySelectorAll('script[data-seo]').forEach((s) => s.remove())
    const blocks = [organizationLd(), ...(jsonLd ? [].concat(jsonLd) : [])]
    blocks.forEach((b) => {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.dataset.seo = ''
      s.textContent = JSON.stringify(b)
      document.head.appendChild(s)
    })
  }, [title, description, path, image, jsonLd])
}

const organizationLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: site.name,
  url: site.url,
  logo: `${site.url}/assets/bmp/brand/bmp-mark.png`,
  address: { '@type': 'PostalAddress', addressLocality: 'Lagos', addressCountry: 'NG' },
  telephone: site.whatsapp.display,
  sameAs: [site.facebook, site.instagram, site.tiktok].filter(Boolean),
})

export const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({
    '@type': 'ListItem', position: i + 1, name, item: `${site.url}${path}`,
  })),
})
