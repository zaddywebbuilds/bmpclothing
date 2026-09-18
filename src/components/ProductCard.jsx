import { Link } from 'react-router-dom'
import { Eye, Plus } from 'lucide-react'
import Img from './Img'
import WishlistButton from './WishlistButton'
import WaIcon from './WaIcon'
import { orderLink } from '../lib/order'
import { useStore } from '../lib/store'
import { altText, categoryByKey } from '../data/catalog'
import { naira } from '../lib/util'
import './product-card.css'

export default function ProductCard({ product: p, sizes = '(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 25vw', priority, className = '' }) {
  const { addToCart, openQuickView } = useStore()
  const second = p.images[1]
  const needsChoice = p.colours.length > 1 || p.variants?.length > 1

  const quickAdd = (e) => {
    e.preventDefault()
    if (needsChoice) openQuickView(p.slug)
    else addToCart(p.slug)
  }

  return (
    <article className={`pcard ${className}`}>
      <div className="pcard-frame">
      <Link to={p.url} className="pcard-media panel" data-cursor="View" aria-label={`${p.title}, ${naira(p.price)}`}>
        <Img id={p.images[0]} alt={altText(p)} sizes={sizes} priority={priority} className="pcard-img" />
        {second && <Img id={second} alt="" sizes={sizes} className="pcard-img pcard-img--alt" aria-hidden="true" />}
        <span className="pcard-tags">
          {p.newIn && <span className="tag">New in</span>}
          {p.worn && <span className="tag">Worn by a customer</span>}
        </span>
      </Link>
      <WishlistButton slug={p.slug} className="pcard-wish" />
      <div className="pcard-actions">
        <button className="pcard-action" onClick={quickAdd} aria-label={needsChoice ? `Choose options for ${p.title}` : `Add ${p.title} to bag`}>
          <Plus size={15} strokeWidth={1.8} /> <span>{needsChoice ? 'Choose' : 'Quick add'}</span>
        </button>
        <button className="pcard-action pcard-action--icon" onClick={(e) => { e.preventDefault(); openQuickView(p.slug) }} aria-label={`Quick view ${p.title}`}>
          <Eye size={15} strokeWidth={1.8} />
        </button>
      </div>
      </div>
      <div className="pcard-info">
        <div className="pcard-meta">
          <span>{p.code || categoryByKey[p.category]?.name}</span>
          {p.colours.length > 1 && (
            <span className="pcard-swatches" aria-label={`${p.colours.length} colours`}>
              {p.colours.map((c) => <i key={c.name} style={{ background: c.hex }} title={c.name} />)}
            </span>
          )}
        </div>
        <h3 className="pcard-title"><Link to={p.url}>{p.title}</Link></h3>
        <p className="price">
          {naira(p.salePrice || p.price)}
          {p.salePrice && <s>{naira(p.price)}</s>}
        </p>
      </div>
      <a className="pcard-wa" href={orderLink(p)} target="_blank" rel="noopener noreferrer" aria-label={`Order ${p.title} on WhatsApp, ${naira(p.price)}`}>
        <WaIcon size={15} /> <span>Order on WhatsApp</span>
      </a>
    </article>
  )
}
