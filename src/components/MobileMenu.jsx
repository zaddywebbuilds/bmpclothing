import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import Drawer from './Drawer'
import Img from './Img'
import Logo from './Logo'
import WaIcon from './WaIcon'
import { useStore } from '../lib/store'
import { categories, productBySlug } from '../data/catalog'
import { site, socials, waLink } from '../data/site'
import SocialIcon from './SocialIcon'

const FEATURE = 'velvet-gold-cut-out-gown'

export default function MobileMenu() {
  const { panel, closePanel } = useStore()
  const open = panel === 'menu'
  const [shop, setShop] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { closePanel() }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps
  const f = productBySlug[FEATURE]

  const links = [['New In', '/new-in'], ['Lookbook', '/lookbook'], ['The BMP Woman', '/the-bmp-woman'], ['About', '/about'], ['Contact', '/contact']]

  return (
    <Drawer open={open} onClose={closePanel} label="Menu" side="left" className="mmenu" title={<Logo />}>
      <nav className="mmenu-nav" aria-label="Mobile">
        <Link to="/new-in" className="mmenu-link" style={{ '--i': 0 }}>New In</Link>
        <button className="mmenu-link" style={{ '--i': 1 }} aria-expanded={shop} onClick={() => setShop((s) => !s)}>
          Shop <ChevronDown size={22} strokeWidth={1.3} className={shop ? 'is-flipped' : ''} />
        </button>
        <div className={`mmenu-sub ${shop ? 'is-open' : ''}`}>
          <div>
            <Link to="/shop">Shop All</Link>
            {categories.filter((c) => c.count).map((c) => (
              <Link key={c.key} to={`/collections/${c.key}`}>{c.name} <sup>{c.count}</sup></Link>
            ))}
          </div>
        </div>
        {links.slice(1).map(([label, to], i) => (
          <Link key={to} to={to} className="mmenu-link" style={{ '--i': i + 2 }}>{label}</Link>
        ))}
      </nav>
      {f && (
        <Link to={f.url} className="mmenu-feature">
          <div className="panel"><Img id={f.images[0]} alt={f.title} sizes="40vw" /></div>
          <div>
            <span className="eyebrow">Shop the latest edit</span>
            <strong>{f.title}</strong>
          </div>
        </Link>
      )}
      <a className="btn btn--glass btn--block mmenu-wa" href={waLink('Hello BMP Clothings 👋 I would like some help with an order.')} target="_blank" rel="noopener noreferrer">
        <WaIcon /> WhatsApp {site.whatsapp.display}
      </a>
      <div className="mmenu-social">
        {socials().map(([name, url]) => (
          <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="icon-btn icon-btn--glass" aria-label={`BMP Clothings on ${name}`}>
            <SocialIcon name={name} size={17} />
          </a>
        ))}
      </div>
    </Drawer>
  )
}
