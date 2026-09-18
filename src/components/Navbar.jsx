import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingBag, ArrowRight } from 'lucide-react'
import Logo from './Logo'
import Img from './Img'
import { useStore } from '../lib/store'
import { categories, occasions, productBySlug } from '../data/catalog'
import { naira } from '../lib/util'
import './nav.css'

const MENU_FEATURE = 'bmp-lg-5'

export default function Navbar() {
  const { count, bump, openPanel, wishlist } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [mega, setMega] = useState(false)
  const [pulse, setPulse] = useState(false)
  const closeTimer = useRef()
  const { pathname } = useLocation()
  const feature = productBySlug[MENU_FEATURE]

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => { setMega(false) }, [pathname])

  useEffect(() => {
    if (!bump) return
    setPulse(true)
    const t = setTimeout(() => setPulse(false), 700)
    return () => clearTimeout(t)
  }, [bump])

  const open = () => { clearTimeout(closeTimer.current); setMega(true) }
  const close = () => { closeTimer.current = setTimeout(() => setMega(false), 160) }

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${mega ? 'is-mega' : ''}`} onKeyDown={(e) => e.key === 'Escape' && setMega(false)}>
      <div className="nav-bar">
        <div className="nav-left">
          <button className="icon-btn nav-burger" aria-label="Open menu" onClick={() => openPanel('menu')}>
            <Menu size={20} strokeWidth={1.5} />
          </button>
          <nav className="nav-links" aria-label="Primary">
            <NavLink to="/new-in" className="nav-link">New In</NavLink>
            <div className="nav-shop" onMouseEnter={open} onMouseLeave={close}>
              <NavLink
                to="/shop"
                className="nav-link"
                aria-expanded={mega}
                aria-controls="mega-menu"
                onFocus={open}
              >
                Shop
              </NavLink>
            </div>
            <NavLink to="/lookbook" className="nav-link">Lookbook</NavLink>
            <NavLink to="/the-bmp-woman" className="nav-link">The BMP Woman</NavLink>
            <NavLink to="/about" className="nav-link">About</NavLink>
          </nav>
        </div>

        <Link to="/" className="nav-logo" aria-label="BMP Clothings home">
          <Logo />
        </Link>

        <div className="nav-right">
          <button className="icon-btn" aria-label="Search" onClick={() => openPanel('search')}>
            <Search size={19} strokeWidth={1.5} />
          </button>
          <Link to="/wishlist" className="icon-btn nav-wish" aria-label={`Wishlist, ${wishlist.length} items`}>
            <Heart size={19} strokeWidth={1.5} />
            {wishlist.length > 0 && <span className="nav-dot" />}
          </Link>
          <button className={`icon-btn nav-bag ${pulse ? 'is-pulse' : ''}`} aria-label={`Shopping bag, ${count} items`} onClick={() => openPanel('cart')}>
            <ShoppingBag size={19} strokeWidth={1.5} />
            <span className="nav-count" aria-hidden="true">{count}</span>
          </button>
        </div>
      </div>

      <div
        id="mega-menu"
        className="mega glass"
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) close() }}
        aria-hidden={!mega}
        inert={!mega}
      >
        <div className="mega-cols">
          <div>
            <p className="eyebrow">Shop</p>
            <ul>
              <li><Link to="/shop">Shop All</Link></li>
              <li><Link to="/new-in">New Arrivals</Link></li>
              <li><Link to="/shop?view=picks">BMP Picks</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">Clothing</p>
            <ul>
              {categories.filter((c) => c.count).map((c) => (
                <li key={c.key}>
                  <Link to={`/collections/${c.key}`}>{c.name}<sup>{c.count}</sup></Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Occasion</p>
            <ul>
              {occasions.map((o) => (
                <li key={o.key}><Link to={`/occasion/${o.key}`}>{o.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        {feature && (
          <Link to={feature.url} className="mega-feature">
            <div className="panel mega-img">
              <Img id={feature.images[0]} alt={feature.title} sizes="260px" />
            </div>
            <div className="mega-feature-copy">
              <span className="eyebrow">Shop the latest edit</span>
              <strong>{feature.title}</strong>
              <span className="price">{naira(feature.price)}</span>
              <span className="link-line">Discover <ArrowRight className="arrow" size={14} /></span>
            </div>
          </Link>
        )}
      </div>
    </header>
  )
}
