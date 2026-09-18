import { useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import ProductCard from './ProductCard'

// Horizontal product rail: native scroll + snap, drag-to-scroll with a mouse, arrow buttons.
export default function Rail({ items, label }) {
  const ref = useRef(null)
  const drag = useRef(null)

  const by = (dir) => {
    const el = ref.current
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }
  const down = (e) => {
    if (e.pointerType !== 'mouse') return
    drag.current = { x: e.clientX, left: ref.current.scrollLeft, moved: false }
  }
  const move = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 4) { d.moved = true; ref.current.classList.add('is-dragging') }
    ref.current.scrollLeft = d.left - dx
  }
  const up = () => {
    ref.current?.classList.remove('is-dragging')
    setTimeout(() => { drag.current = null }, 0)
  }
  const click = (e) => { if (drag.current?.moved) { e.preventDefault(); e.stopPropagation() } }

  return (
    <div className="rail-wrap">
      <div
        ref={ref}
        className="rail"
        role="list"
        aria-label={label}
        data-cursor="Drag"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        onClickCapture={click}
        onDragStart={(e) => e.preventDefault()}
      >
        {items.map((p) => (
          <div role="listitem" className="rail-item" key={p.slug}>
            <ProductCard product={p} sizes="(max-width: 640px) 72vw, (max-width: 1100px) 40vw, 24vw" />
          </div>
        ))}
      </div>
      <div className="rail-nav">
        <button className="icon-btn icon-btn--glass" onClick={() => by(-1)} aria-label="Scroll back"><ArrowLeft size={17} strokeWidth={1.5} /></button>
        <button className="icon-btn icon-btn--glass" onClick={() => by(1)} aria-label="Scroll forward"><ArrowRight size={17} strokeWidth={1.5} /></button>
      </div>
    </div>
  )
}
