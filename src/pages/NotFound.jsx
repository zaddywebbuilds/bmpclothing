import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useSeo } from '../lib/seo'
import './pages.css'

export default function NotFound() {
  useSeo({ title: 'Page not found' })
  return (
    <section className="wrap page-hero notfound">
      <p className="index-label">404</p>
      <h1 className="display caps h-xl">This look <em>has left the room.</em></h1>
      <p className="lede">The page you were looking for isn't here. The rest of BMP is.</p>
      <div className="page-actions">
        <Link to="/shop" className="btn">Shop BMP <ArrowRight className="arrow" size={15} /></Link>
        <Link to="/" className="btn btn--glass">Back home</Link>
      </div>
    </section>
  )
}
