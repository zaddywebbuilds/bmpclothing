import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Logo from './Logo'
import WaIcon from './WaIcon'
import { listedCategories } from '../data/catalog'
import { fullAddress, mapsEmbed, mapsLink, site, socials, waLink } from '../data/site'
import SocialIcon from './SocialIcon'
import './footer.css'

export default function Footer() {
  const social = socials()

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
              {listedCategories.map((c) => (
                <Link key={c.key} to={`/collections/${c.key}`}>{c.name}</Link>
              ))}
            </div>
            <div>
              <p className="eyebrow">Help</p>
              <Link to="/contact">Contact</Link>
              <Link to="/shipping">Shipping</Link>
              <Link to="/returns">Returns</Link>
              <Link to="/size-guide">Size Guide</Link>
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
                <a key={name} href={url} target="_blank" rel="noopener noreferrer"><SocialIcon name={name} size={14} /> {name} <ArrowUpRight size={13} /></a>
              ))}
              <span className="footer-muted">{site.location}</span>
            </div>
          </nav>
        </div>

        <div className="footer-feature">
          <div className="footer-giant display" aria-hidden="true">BMP</div>

          <div className="footer-map">
            <p className="eyebrow">Visit the store</p>
            <div className="footer-map-frame">
              <iframe
                src={mapsEmbed}
                title={`Map showing BMP Clothings at ${fullAddress}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a className="footer-map-link" href={mapsLink} target="_blank" rel="noopener noreferrer">
              {site.address.street}, {site.address.area} <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        <div className="footer-base">
          <span>© {new Date().getFullYear()} BMP Clothings. All rights reserved.</span>
          <span>Quality you can see. Style you can feel.</span>
        </div>
      </div>
    </footer>
  )
}
