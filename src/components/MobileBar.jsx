import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Search } from 'lucide-react'
import WaIcon from './WaIcon'
import { useStore } from '../lib/store'
import { waLink } from '../data/site'
import './mobile-bar.css'

// Persistent mobile action bar. Product pages have their own order bar, so it steps aside there.
export default function MobileBar() {
  const { count, openPanel } = useStore()
  const { pathname } = useLocation()
  if (pathname.startsWith('/product/')) return null

  return (
    <nav className="mbar" aria-label="Quick actions">
      <Link to="/shop" className="mbar-btn">
        <Search size={17} strokeWidth={1.6} />
        <span>Shop</span>
      </Link>
      <a className="mbar-btn mbar-btn--wa" href={waLink('Hello BMP Clothings 👋')} target="_blank" rel="noopener noreferrer">
        <WaIcon size={17} />
        <span>WhatsApp</span>
      </a>
      <button className="mbar-btn" onClick={() => openPanel('cart')} aria-label={`Open bag, ${count} items`}>
        <ShoppingBag size={17} strokeWidth={1.6} />
        <span>Bag{count > 0 ? ` (${count})` : ''}</span>
      </button>
    </nav>
  )
}
