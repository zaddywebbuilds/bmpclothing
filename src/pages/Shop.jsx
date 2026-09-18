import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Drawer from '../components/Drawer'
import Reveal, { Lines } from '../components/Reveal'
import NotFound from './NotFound'
import { categories, categoryByKey, occasionByKey, occasions, products } from '../data/catalog'
import { useSeo, breadcrumbLd } from '../lib/seo'
import './shop.css'

const PRICE_BANDS = [
  { key: 'u30', label: 'Up to ₦30,000', test: (p) => p.price <= 30000 },
  { key: '30-50', label: '₦30,000 – ₦50,000', test: (p) => p.price > 30000 && p.price <= 50000 },
  { key: 'o50', label: 'Over ₦50,000', test: (p) => p.price > 50000 },
]
const SORTS = [
  ['featured', 'Featured'],
  ['newest', 'Newest'],
  ['price-asc', 'Price: Low to High'],
  ['price-desc', 'Price: High to Low'],
]
const ACCENT = ['I', 'II', 'III', 'IV', 'V', 'VI']

export default function Shop({ mode = 'all' }) {
  const { category, occasion } = useParams()
  const [params] = useSearchParams()
  const picksView = params.get('view') === 'picks'

  const ctx = useMemo(() => {
    if (mode === 'category') {
      const c = categoryByKey[category]
      if (!c) return null
      const i = categories.indexOf(c)
      return { title: c.name, blurb: c.blurb, base: products.filter((p) => p.category === c.key), label: `Collection ${ACCENT[i]}`, path: `/collections/${c.key}` }
    }
    if (mode === 'occasion') {
      const o = occasionByKey[occasion]
      if (!o) return null
      return { title: o.name, blurb: o.line, base: products.filter((p) => p.occasions?.includes(o.key)), label: 'Shop by occasion', path: `/occasion/${o.key}` }
    }
    if (mode === 'new') return { title: 'New In', blurb: 'Fresh from the BMP store in Lagos. The newest pieces, first.', base: products.filter((p) => p.newIn), label: 'Just arrived', path: '/new-in' }
    if (picksView) return { title: 'BMP Picks', blurb: 'The pieces we would pack for every celebration this season.', base: products.filter((p) => p.pick), label: 'Chosen by BMP', path: '/shop?view=picks' }
    return { title: 'Shop All', blurb: 'Every BMP piece in one place. Gowns, minis, jumpsuits, tops and sets for the woman who loves to be seen.', base: products, label: `${products.length} pieces`, path: '/shop' }
  }, [mode, category, occasion, picksView])

  const [filters, setFilters] = useState({ cat: [], colour: [], price: [] })
  const [sort, setSort] = useState('featured')
  const [drawer, setDrawer] = useState(false)

  const facet = useMemo(() => {
    if (!ctx) return {}
    const colourCount = {}
    ctx.base.forEach((p) => p.colours.forEach((c) => { colourCount[c.name] = (colourCount[c.name] || 0) + 1 }))
    return {
      cats: categories.filter((c) => ctx.base.some((p) => p.category === c.key)),
      colours: Object.entries(colourCount).sort((a, b) => b[1] - a[1]).map(([n]) => n),
      colourHex: Object.fromEntries(ctx.base.flatMap((p) => p.colours.map((c) => [c.name, c.hex]))),
      bands: PRICE_BANDS.filter((b) => ctx.base.some(b.test)),
    }
  }, [ctx])

  const list = useMemo(() => {
    if (!ctx) return []
    let r = ctx.base.filter((p) =>
      (!filters.cat.length || filters.cat.includes(p.category)) &&
      (!filters.colour.length || p.colours.some((c) => filters.colour.includes(c.name))) &&
      (!filters.price.length || PRICE_BANDS.filter((b) => filters.price.includes(b.key)).some((b) => b.test(p))),
    )
    if (sort === 'newest') r = [...r].sort((a, b) => (b.newIn ? 1 : 0) - (a.newIn ? 1 : 0) || a.order - b.order)
    if (sort === 'price-asc') r = [...r].sort((a, b) => a.price - b.price || a.order - b.order)
    if (sort === 'price-desc') r = [...r].sort((a, b) => b.price - a.price || a.order - b.order)
    return r
  }, [ctx, filters, sort])

  const crumbs = [['Home', '/'], ['Shop', '/shop']]
  if (ctx && ctx.path !== '/shop') crumbs.push([ctx.title, ctx.path])
  useSeo({
    title: ctx ? (mode === 'category' ? ctx.title : ctx.title === 'Shop All' ? "Shop Women's Fashion" : ctx.title) : 'Not found',
    description: ctx ? `${ctx.blurb} Shop ${ctx.base.length} ${ctx.title.toLowerCase()} pieces from BMP Clothings, Lagos. Clear Naira prices and easy WhatsApp ordering.` : undefined,
    path: ctx?.path,
    jsonLd: ctx ? [breadcrumbLd(crumbs), {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: ctx.title,
      mainEntity: { '@type': 'ItemList', numberOfItems: ctx.base.length, itemListElement: ctx.base.slice(0, 30).map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://zaddywebbuilds.github.io/bmpclothing${p.url}`, name: p.title })) },
    }] : undefined,
  })

  if (!ctx) return <NotFound />

  const toggle = (group, v) => setFilters((f) => ({ ...f, [group]: f[group].includes(v) ? f[group].filter((x) => x !== v) : [...f[group], v] }))
  const active = filters.cat.length + filters.colour.length + filters.price.length
  const clear = () => setFilters({ cat: [], colour: [], price: [] })

  const FilterBody = (
    <div className="filters">
      {facet.cats.length > 1 && (
        <fieldset>
          <legend>Category</legend>
          <div className="filter-chips">
            {facet.cats.map((c) => (
              <button key={c.key} className="chip" aria-pressed={filters.cat.includes(c.key)} onClick={() => toggle('cat', c.key)}>{c.name}</button>
            ))}
          </div>
        </fieldset>
      )}
      {facet.colours.length > 0 && (
        <fieldset>
          <legend>Colour</legend>
          <div className="filter-chips">
            {facet.colours.map((c) => (
              <button key={c} className="chip" aria-pressed={filters.colour.includes(c)} onClick={() => toggle('colour', c)}>
                <i className="filter-dot" style={{ background: facet.colourHex[c] }} /> {c}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {facet.bands.length > 1 && (
        <fieldset>
          <legend>Price</legend>
          <div className="filter-chips">
            {facet.bands.map((b) => (
              <button key={b.key} className="chip" aria-pressed={filters.price.includes(b.key)} onClick={() => toggle('price', b.key)}>{b.label}</button>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  )

  return (
    <div className={`shop shop--${mode}`}>
      <Reveal className="shop-hero wrap">
        <div className="shop-hero-copy">
          <nav className="crumbs reveal" aria-label="Breadcrumb">
            {crumbs.map(([n, to], i) => (
              <span key={to}>{i < crumbs.length - 1 ? <Link to={to}>{n}</Link> : <span aria-current="page">{n}</span>}</span>
            ))}
          </nav>
          <p className="index-label reveal">{ctx.label}</p>
          <h1 className="display caps h-xl"><Lines lines={[ctx.title]} /></h1>
          <p className="lede reveal" data-delay="2">{ctx.blurb}</p>
        </div>
      </Reveal>

      {(mode === 'all' || mode === 'category') && !picksView && (
        <nav className="wrap shop-cats" aria-label="Collections">
          <Link to="/shop" className={`chip ${mode === 'all' ? 'is-active' : ''}`}>All</Link>
          {categories.filter((c) => c.count).map((c) => (
            <Link key={c.key} to={`/collections/${c.key}`} className={`chip ${category === c.key ? 'is-active' : ''}`}>{c.name}</Link>
          ))}
        </nav>
      )}
      {mode === 'occasion' && (
        <nav className="wrap shop-cats" aria-label="Occasions">
          {occasions.map((o) => (
            <Link key={o.key} to={`/occasion/${o.key}`} className={`chip ${occasion === o.key ? 'is-active' : ''}`}>{o.name}</Link>
          ))}
        </nav>
      )}

      <div className="wrap shop-toolbar">
        <p className="shop-count" aria-live="polite"><strong>{list.length}</strong> {list.length === 1 ? 'piece' : 'pieces'}</p>
        <div className="shop-tools">
          <button className="chip" onClick={() => setDrawer(true)}>
            <SlidersHorizontal size={14} /> Filter {active > 0 && <span className="filter-count">{active}</span>}
          </button>
          <label className="sort">
            <span className="sr-only">Sort by</span>
            <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </label>
        </div>
      </div>

      {active > 0 && (
        <div className="wrap shop-active">
          {filters.cat.map((k) => <button key={k} className="chip" onClick={() => toggle('cat', k)}>{categoryByKey[k].name} <X size={12} /></button>)}
          {filters.colour.map((k) => <button key={k} className="chip" onClick={() => toggle('colour', k)}>{k} <X size={12} /></button>)}
          {filters.price.map((k) => <button key={k} className="chip" onClick={() => toggle('price', k)}>{PRICE_BANDS.find((b) => b.key === k).label} <X size={12} /></button>)}
          <button className="link-line" onClick={clear}>Clear all</button>
        </div>
      )}

      <section className="wrap shop-grid-wrap" aria-label="Products">
        {list.length ? (
          <div className="grid-products shop-grid" key={`${sort}-${JSON.stringify(filters)}-${ctx.path}`}>
            {list.map((p, i) => (
              <div key={p.slug} className="shop-cell" style={{ '--d': `${Math.min(i, 12) * 40}ms` }}>
                <ProductCard product={p} priority={i < 4} />
              </div>
            ))}
          </div>
        ) : (
          <div className="shop-empty glass">
            <p className="display h-sm">No pieces match those filters.</p>
            <button className="btn" onClick={clear}>Clear filters</button>
          </div>
        )}
      </section>

      <Drawer open={drawer} onClose={() => setDrawer(false)} label="Filters" title={<span className="display h-sm">Filter</span>}>
        <div className="ov-body">{FilterBody}</div>
        <div className="cart-foot">
          <button className="btn btn--block" onClick={() => setDrawer(false)}>Show {list.length} pieces</button>
          {active > 0 && <button className="btn btn--glass btn--block" onClick={clear}>Clear all</button>}
        </div>
      </Drawer>
    </div>
  )
}
