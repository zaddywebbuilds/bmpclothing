import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Logo from './Logo'
import WaIcon from './WaIcon'
import { categories } from '../data/catalog'
import { site, waLink } from '../data/site'
import './footer.css'

export default function Footer() {
  const social = [
    ['Facebook', site.facebook],
    ['Instagram', site.instagram],
    ['TikTok', site.tiktok],
  ].filter(([, url]) => url)

  return (
    <footer className="footer wrap">
      <div className="surface-dark footer-card on-dark">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo light />
            <p className="footer-line display">
              If you see BMP Woman, <em>you go know.</em>
            </p>
            <a className="btn btn--light" href={waLink('Hello BMP Clothings 👋')} target="_blank" rel="noopener noreferrer">
              <WaIcon /> Chat on WhatsApp
            </a>
          </div>

          <nav className="footer-cols" aria-label="Footer">
            <div>
              <p className="eyebrow">Shop</p>
              <Link to="/new-in">New Arrivals</Link>
              <Link to="/shop">Shop All</Link>
              {categories.filter((c) => c.count).map((c) => (
                <Link key={c.key} to={`/collections/${c.key}`}>{c.name}</Link>
              ))}
            </div>
            <div>
              <p className="eyebrow">Help</p>
              <Link to="/contact">Contact</Link>
              <Link to="/shipping">Shipping</Link>
              <Link to="/returns">Returns</Link>
              <Link to="/faq">FAQ</Link>
            </div>
            <div>
              <p className="eyebrow">Company</p>
              <Link to="/about">About BMP</Link>
              <Link to="/the-bmp-woman">The BMP Woman</Link>
              <Link to="/lookbook">Lookbook</Link>
            </div>
            <div>
              <p className="eyebrow">Connect</p>
              <a href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp {site.whatsapp.display}</a>
              {social.map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer">{name} <ArrowUpRight size={13} /></a>
              ))}
              <span className="footer-muted">{site.location}</span>
            </div>
          </nav>
        </div>

        <div className="footer-giant display" aria-hidden="true">BMP</div>

        <div className="footer-base">
          <span>© {new Date().getFullYear()} BMP Clothings. All rights reserved.</span>
          <span>Quality you can see. Style you can feel.</span>
        </div>
      </div>
    </footer>
  )
}
