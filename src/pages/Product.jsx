import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, MessageCircle, Minus, Plus, Truck, RefreshCw } from 'lucide-react'
import Gallery from '../components/Gallery'
import OptionPicker, { useOptions } from '../components/OptionPicker'
import AddToBag from '../components/AddToBag'
import WishlistButton from '../components/WishlistButton'
import WaIcon from '../components/WaIcon'
import ProductCard from '../components/ProductCard'
import Accordion, { AccordionItem } from '../components/Accordion'
import Reveal, { Lines } from '../components/Reveal'
import NotFound from './NotFound'
import { productBySlug, products, categoryByKey, occasionByKey, imagePath } from '../data/catalog'
import { site } from '../data/site'
import { naira, asset } from '../lib/util'
import { orderLink, enquiryLink } from '../lib/order'
import { useSeo, breadcrumbLd } from '../lib/seo'
import './product.css'

const related = (p) => {
  const same = products.filter((x) => x.slug !== p.slug && x.category === p.category)
  const shared = products.filter((x) => x.slug !== p.slug && x.category !== p.category && x.occasions?.some((o) => p.occasions?.includes(o)))
  return [...same.slice(0, 3), ...shared].slice(0, 4)
}

export default function Product() {
  const { slug } = useParams()
  const p = productBySlug[slug]
  const opts = useOptions(p)
  const [qty, setQty] = useState(1)

  const cat = p && categoryByKey[p.category]
  useSeo({
    title: p ? `${p.title}${p.code ? ` (${p.code})` : ''}` : 'Piece not found',
    description: p ? `${p.description.slice(0, 150).replace(/\s\S*$/, '')}… ${naira(p.price)} at BMP Clothings, Lagos.` : undefined,
    path: p ? p.url : undefined,
    image: p ? imagePath(p.images[0]) : undefined,
    jsonLd: p ? [
      {
        '@context': 'https://schema.org', '@type': 'Product',
        name: p.title, sku: p.sku || p.slug, brand: { '@type': 'Brand', name: 'BMP Clothings' },
        description: p.description, category: cat.name,
        image: p.images.map((id) => `${site.url}/${imagePath(id)}`),
        ...(p.colours.length ? { color: p.colours.map((c) => c.name).join(', ') } : {}),
        offers: {
          '@type': 'Offer', priceCurrency: 'NGN', price: p.price, url: `${site.url}${p.url}`,
          ...(p.inStock ? { availability: 'https://schema.org/InStock' } : {}),
          seller: { '@type': 'Organization', name: 'BMP Clothings' },
        },
      },
      breadcrumbLd([['Home', '/'], ['Shop', '/shop'], [cat.name, `/collections/${cat.key}`], [p.title, p.url]]),
    ] : undefined,
  })

  if (!p) return <NotFound />

  const variant = opts.label
  return (
    <>
      <article className="pdp wrap">
        <div className="pdp-media">
          <Gallery product={p} focus={opts.image} />
        </div>

        <div className="pdp-info">
          <nav className="crumbs" aria-label="Breadcrumb">
            <span><Link to="/shop">Shop</Link></span>
            <span><Link to={`/collections/${cat.key}`}>{cat.name}</Link></span>
          </nav>
          <div className="pdp-head">
            {p.code && <span className="eyebrow">{p.code}</span>}
            {p.newIn && <span className="tag tag--ink">New in</span>}
          </div>
          <h1 className="display pdp-title">{p.title}</h1>
          <p className="price pdp-price">{naira(p.price)}</p>
          <p className="pdp-desc">{p.description}</p>

          {p.occasions?.length > 0 && (
            <div className="pdp-occasions">
              <span className="eyebrow">Wear it for</span>
              {p.occasions.map((o) => <Link key={o} to={`/occasion/${o}`} className="chip">{occasionByKey[o].name}</Link>)}
            </div>
          )}

          <OptionPicker product={p} opts={opts} />

          <div className="pdp-buy">
            <div className="qty" role="group" aria-label="Quantity">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus size={13} /></button>
              <span aria-live="polite">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase quantity"><Plus size={13} /></button>
            </div>
            <AddToBag product={p} variant={variant} qty={qty} disabled={!opts.ready} disabledLabel={opts.needColour && !opts.colour ? 'Choose colour' : 'Choose size'} />
            <WishlistButton slug={p.slug} className="pdp-wish" />
          </div>
          <a className="btn btn--glass btn--block pdp-wa" href={orderLink(p, { variant, qty })} target="_blank" rel="noopener noreferrer">
            <WaIcon /> Order on WhatsApp · {naira(p.price * qty)}
          </a>
          <a className="pdp-ask" href={enquiryLink(p, variant)} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={15} strokeWidth={1.6} /> Ask about this piece
          </a>

          <ul className="pdp-assure">
            <li><Truck size={16} strokeWidth={1.5} /> Delivery confirmed for your location before you pay</li>
            <li><RefreshCw size={16} strokeWidth={1.5} /> Incorrect or damaged item? <Link to="/returns">See returns</Link></li>
          </ul>

          <Accordion>
            <AccordionItem title="Fit & details" defaultOpen>
              <ul className="pdp-details">
                {p.details.map((d) => <li key={d}>{d}</li>)}
                {p.sku && <li className="pdp-sku">SKU: {p.sku}</li>}
              </ul>
            </AccordionItem>
            <AccordionItem title="Sizing">
              <p>{opts.chart ? 'Available in UK sizes 8 to 22. Use Find my size above with your bust, waist and hip, or check the full chart.' : 'Available sizes are shown above.'} Need help? Message us and we will confirm the best fit before you order.</p>
              <Link className="link-line" to="/size-guide">Size chart <ArrowRight className="arrow" size={13} /></Link>
            </AccordionItem>
            <AccordionItem title="Delivery">
              <p>Delivery time and charges depend on your location and are confirmed with you before payment. When your order is dispatched we share delivery or tracking information where available.</p>
              <Link className="link-line" to="/shipping">Shipping information <ArrowRight className="arrow" size={13} /></Link>
            </AccordionItem>
            <AccordionItem title="Returns">
              <p>If you receive an incorrect, damaged or defective item, contact us as soon as possible after delivery. Items must be unused, unworn and in original condition with packaging and labels.</p>
              <Link className="link-line" to="/returns">Returns & exchanges <ArrowRight className="arrow" size={13} /></Link>
            </AccordionItem>
          </Accordion>
        </div>
      </article>

      <Reveal className="section section--tight wrap pdp-related" aria-labelledby="rel-title">
        <div className="section-head">
          <h2 id="rel-title" className="display caps h-md"><Lines lines={['Complete', <em key="l">the look</em>]} /></h2>
          <Link to={`/collections/${cat.key}`} className="link-line reveal">More {cat.name.toLowerCase()} <ArrowRight className="arrow" size={14} /></Link>
        </div>
        <div className="grid-products">
          {related(p).map((r, i) => <div key={r.slug} className="reveal" data-delay={i + 1}><ProductCard product={r} /></div>)}
        </div>
      </Reveal>

      <div className="pdp-sticky glass" aria-hidden="false">
        <img src={asset(imagePath(p.images[0], 480))} alt="" width="40" height="40" />
        <div className="pdp-sticky-copy"><strong>{p.title}</strong><span className="price">{naira(p.price)}</span></div>
        <a className="btn btn--sm" href={orderLink(p, { variant, qty })} target="_blank" rel="noopener noreferrer" aria-label={`Order ${p.title} on WhatsApp`}><WaIcon size={14} /> Order</a>
      </div>
    </>
  )
}
