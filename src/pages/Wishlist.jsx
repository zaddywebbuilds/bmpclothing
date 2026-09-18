import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal, { Lines } from '../components/Reveal'
import ProductCard from '../components/ProductCard'
import { useStore } from '../lib/store'
import { productBySlug } from '../data/catalog'
import { useSeo } from '../lib/seo'
import './pages.css'

export default function Wishlist() {
  const { wishlist } = useStore()
  useSeo({ title: 'Wishlist', path: '/wishlist' })
  const items = wishlist.map((s) => productBySlug[s]).filter(Boolean)
  return (
    <div>
      <Reveal className="wrap page-hero">
        <p className="index-label reveal">Saved on this device</p>
        <h1 className="display caps h-xl"><Lines lines={['Your', <em key="w">wishlist</em>]} /></h1>
      </Reveal>
      <section className="section section--tight wrap">
        {items.length ? (
          <div className="grid-products">{items.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
        ) : (
          <div className="glass bag-empty">
            <p className="display h-sm">Tap the heart on any piece to save it here.</p>
            <Link to="/shop" className="btn">Start browsing <ArrowRight className="arrow" size={15} /></Link>
          </div>
        )}
      </section>
    </div>
  )
}
