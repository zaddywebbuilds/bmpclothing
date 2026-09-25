import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Img from './Img'
import { altText } from '../data/catalog'
import { naira, prefersReducedMotion } from '../lib/util'
import './coverflow.css'

// A true CSS-3D ring: each face sits on a circle via rotateY(θ) translateZ(r),
// and the ring itself counter-rotates so the active face meets the camera.
export default function Coverflow({ items, radius = 520, auto = 4200 }) {
  const n = items.length
  const step = 360 / n
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const still = prefersReducedMotion()

  const go = useCallback((d) => setI((v) => (v + d + n) % n), [n])

  useEffect(() => {
    if (still || paused || !auto || n < 2) return
    const t = setInterval(() => setI((v) => (v + 1) % n), auto)
    return () => clearInterval(t)
  }, [still, paused, auto, n])

  const active = items[i]

  return (
    <div
      className="cf"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="cf-scene">
        <div
          className="cf-ring"
          style={{ transform: `translateZ(-${radius}px) rotateY(${-i * step}deg)` }}
        >
          {items.map((p, idx) => {
            const rel = ((idx - i) % n + n) % n
            const d = Math.min(rel, n - rel)      // 0 at front, grows to the back
            const front = d === 0
            return (
              <div
                key={p.slug}
                className={`cf-face ${front ? 'is-front' : ''}`}
                style={{
                  transform: `rotateY(${idx * step}deg) translateZ(${radius}px)`,
                  opacity: d > 3 ? 0 : 1 - d * 0.22,
                  filter: `brightness(${1 - d * 0.26}) saturate(${1 - d * 0.18})`,
                  zIndex: n - d,
                  pointerEvents: front ? 'auto' : 'none',
                }}
                aria-hidden={!front}
              >
                <Link to={p.url} className="cf-card panel" tabIndex={front ? 0 : -1} data-cursor="View">
                  <Img
                    id={p.images[0]}
                    alt={altText(p)}
                    sizes="(max-width: 900px) 62vw, 300px"
                    priority={idx < 3}
                  />
                  <span className="cf-sheen" aria-hidden="true" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* floating control capsule, mirroring the template's stacked stage buttons */}
      <div className="cf-ctrl">
        <button onClick={() => go(-1)} aria-label="Previous piece"><ChevronLeft size={18} strokeWidth={1.8} /></button>
        <span className="cf-ctrl-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}<i>/{String(n).padStart(2, '0')}</i></span>
        <button onClick={() => go(1)} aria-label="Next piece"><ChevronRight size={18} strokeWidth={1.8} /></button>
      </div>

      {active && (
        <Link to={active.url} className="cf-meta glass" aria-live="polite">
          <span className="cf-meta-t">{active.title}</span>
          <span className="price">{naira(active.price)}</span>
        </Link>
      )}
    </div>
  )
}
