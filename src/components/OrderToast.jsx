import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import Img from './Img'
import { site } from '../data/site'
import { newIn, productBySlug } from '../data/catalog'
import { naira } from '../lib/util'
import './toast.css'

const ago = (iso) => {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`
  const h = Math.round(mins / 60)
  if (h < 24) return `${h} hr${h > 1 ? 's' : ''} ago`
  const d = Math.round(h / 24)
  return `${d} day${d > 1 ? 's' : ''} ago`
}

// Real orders from site.recentOrders when present; otherwise genuine new-arrival notices.
const buildFeed = () => {
  const orders = (site.recentOrders || [])
    .filter((o) => productBySlug[o.slug])
    .map((o) => ({ kind: 'order', p: productBySlug[o.slug], head: `${o.name} from ${o.city}`, sub: `ordered this · ${ago(o.when)}` }))
  if (orders.length) return orders
  return newIn.map((p) => ({ kind: 'new', p, head: 'Just in at BMP', sub: naira(p.price) }))
}

const FIRST_DELAY = 9000
const SHOW_FOR = 6500
const GAP = 22000

export default function OrderToast() {
  const feed = useMemo(buildFeed, [])
  const [i, setI] = useState(0)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem('bmp.toast') === 'off' } catch { return false }
  })
  const { pathname } = useLocation()
  const hideHere = pathname.startsWith('/bag')

  useEffect(() => {
    if (dismissed || !feed.length) return
    let t
    const cycle = (delay) => {
      t = setTimeout(() => {
        setVisible(true)
        t = setTimeout(() => {
          setVisible(false)
          setI((n) => (n + 1) % feed.length)
          cycle(GAP)
        }, SHOW_FOR)
      }, delay)
    }
    cycle(FIRST_DELAY)
    return () => clearTimeout(t)
  }, [dismissed, feed.length])

  if (dismissed || !feed.length || hideHere) return null
  const item = feed[i]

  return (
    <div className={`toast glass ${visible ? "is-visible" : ""} ${pathname.startsWith("/product") ? "is-raised" : ""}`} role="status" aria-live="polite" aria-hidden={!visible}>
      <Link to={item.p.url} className="toast-link" tabIndex={visible ? 0 : -1}>
        <div className="panel toast-img"><Img id={item.p.images[0]} alt="" sizes="64px" /></div>
        <div className="toast-copy">
          <span className="toast-head">{item.head}</span>
          <strong>{item.p.title}</strong>
          <span className="toast-sub">{item.sub}</span>
        </div>
      </Link>
      <button
        className="toast-close"
        aria-label="Hide notifications"
        tabIndex={visible ? 0 : -1}
        onClick={() => {
          setDismissed(true)
          try { sessionStorage.setItem('bmp.toast', 'off') } catch { /* ignore */ }
        }}
      >
        <X size={14} />
      </button>
    </div>
  )
}
