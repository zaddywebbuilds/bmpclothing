import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal, { Lines } from '../components/Reveal'
import { CartLines } from '../components/CartDrawer'
import ProductCard from '../components/ProductCard'
import WaIcon from '../components/WaIcon'
import { useStore } from '../lib/store'
import { naira } from '../lib/util'
import { checkoutLink } from '../lib/order'
import { newIn } from '../data/catalog'
import { useSeo } from '../lib/seo'
import '../components/overlays.css'
import './pages.css'

export default function Bag() {
  const { lines, subtotal, count, clearCart } = useStore()
  useSeo({ title: 'Your Bag', path: '/bag' })
  return (
    <div>
      <Reveal className="wrap page-hero">
        <p className="index-label reveal">{count} {count === 1 ? 'piece' : 'pieces'}</p>
        <h1 className="display caps h-xl"><Lines lines={['Your', <em key="b">bag</em>]} /></h1>
      </Reveal>
      {lines.length ? (
        <section className="section section--tight wrap bag-grid">
          <div className="glass bag-lines"><CartLines /></div>
          <aside className="glass bag-summary">
            <h2 className="eyebrow">Order summary</h2>
            <div className="cart-total"><span>Subtotal</span><span className="price">{naira(subtotal)}</span></div>
            <p className="form-note">Delivery is calculated for your location. We confirm delivery and payment details with you on WhatsApp before you pay.</p>
            <a className="btn btn--block" href={checkoutLink(lines, subtotal)} target="_blank" rel="noopener noreferrer"><WaIcon /> Checkout on WhatsApp</a>
            <Link to="/shop" className="btn btn--glass btn--block">Continue shopping</Link>
            <button className="cart-remove" onClick={clearCart}>Empty bag</button>
          </aside>
        </section>
      ) : (
        <section className="section section--tight wrap">
          <div className="glass bag-empty">
            <p className="display h-sm">Your bag is waiting for its first BMP piece.</p>
            <Link to="/new-in" className="btn">Shop new in <ArrowRight className="arrow" size={15} /></Link>
          </div>
          <div className="grid-products bag-suggest">
            {newIn.slice(8, 12).map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
