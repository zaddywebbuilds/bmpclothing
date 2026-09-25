import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import Drawer from './Drawer'
import Img from './Img'
import { useStore } from '../lib/store'
import { products, categories, categoryByKey } from '../data/catalog'
import { naira } from '../lib/util'

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const index = products.map((p) => ({
  p,
  text: norm([p.title, p.code, categoryByKey[p.category]?.name, ...(p.colours || []).map((c) => c.name), p.description].join(' ')),
}))

export default function SearchOverlay() {
  const { panel, closePanel } = useStore()
  const open = panel === 'search'
  const [q, setQ] = useState('')
  useEffect(() => { if (!open) setQ('') }, [open])

  const results = useMemo(() => {
    const terms = norm(q).split(/\s+/).filter(Boolean)
    if (!terms.length) return []
    return index.filter((r) => terms.every((t) => r.text.includes(t))).map((r) => r.p).slice(0, 12)
  }, [q])

  return (
    <Drawer open={open} onClose={closePanel} label="Search products" side="top" className="search">
      <div className="search-inner wrap">
        <label className="search-field">
          <Search size={22} strokeWidth={1.4} />
          <span className="sr-only">Search BMP</span>
          <input
            data-autofocus
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search gowns, jumpsuits, colours…"
            autoComplete="off"
          />
          <button type="button" className="link-line" onClick={closePanel}>Close</button>
        </label>

        {!q && (
          <div className="search-suggest">
            <span className="eyebrow">Popular searches</span>
            <div className="search-chips">
              {['Red', 'Long gown', 'Mini', 'Jumpsuit', 'Black', 'Off-shoulder'].map((s) => (
                <button key={s} className="chip" onClick={() => setQ(s)}>{s}</button>
              ))}
              {categories.filter((c) => c.count).map((c) => (
                <Link key={c.key} to={`/collections/${c.key}`} className="chip" onClick={closePanel}>{c.name}</Link>
              ))}
            </div>
          </div>
        )}

        {q && (
          <div className="search-results" aria-live="polite">
            <p className="eyebrow">{results.length ? `${results.length} result${results.length > 1 ? 's' : ''}` : 'No pieces match that search yet'}</p>
            <ul>
              {results.map((p) => (
                <li key={p.slug}>
                  <Link to={p.url} onClick={closePanel} className="search-hit">
                    <div className="panel"><Img id={p.images[0]} alt={p.title} sizes="160px" /></div>
                    <strong>{p.title}</strong>
                    <span className="price">{naira(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Drawer>
  )
}
