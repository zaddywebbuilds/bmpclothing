import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/util'

// Small follower dot on fine pointers; grows into a label over [data-cursor] targets.
export default function Cursor() {
  const ref = useRef(null)
  const [enabled] = useState(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion())
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    let x = -100, y = -100, cx = x, cy = y, raf
    const move = (e) => {
      x = e.clientX; y = e.clientY
      const t = e.target.closest?.('[data-cursor]')
      setLabel(t ? t.getAttribute('data-cursor') : '')
      el.classList.remove('is-hidden')
    }
    const leave = () => el.classList.add('is-hidden')
    const loop = () => {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    loop()
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div ref={ref} className={`cursor is-hidden ${label ? 'is-label' : ''}`} aria-hidden="true">
      <span>{label}</span>
    </div>
  )
}
