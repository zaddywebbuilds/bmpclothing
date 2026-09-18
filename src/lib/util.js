import { useEffect, useRef, useState } from 'react'

export const naira = (n) => `₦${Math.round(n).toLocaleString('en-NG')}`

export const asset = (p) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Adds .is-in to the element (and any [data-reveal] children) once it scrolls into view.
export function useReveal(options = {}) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const targets = [el, ...el.querySelectorAll('.reveal, .reveal-img, .mask-line')]
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      targets.forEach((t) => t.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: options.rootMargin || '0px 0px -12% 0px', threshold: options.threshold || 0.01 },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [options.rootMargin, options.threshold])
  return ref
}

// Progress 0→1 of an element travelling through the viewport; drives parallax & layered scenes.
export function useScrollProgress(ref, { start = 'bottom', end = 'top' } = {}) {
  const [p, setP] = useState(0)
  useEffect(() => {
    if (prefersReducedMotion()) return
    let raf = 0
    const tick = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const from = start === 'bottom' ? vh : start === 'top' ? 0 : vh / 2
      const to = end === 'top' ? -r.height : end === 'bottom' ? vh - r.height : -r.height / 2
      const v = (from - r.top) / (from - to)
      setP(Math.max(0, Math.min(1, v)))
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [ref, start, end])
  return p
}

export function useMediaQuery(q) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setM(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}

// Traps Tab focus inside an open dialog and restores focus on close.
export function useFocusTrap(active, ref, onClose) {
  useEffect(() => {
    if (!active) return
    const prev = document.activeElement
    const el = ref.current
    const sel = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const first = () => el?.querySelectorAll(sel)[0]
    const t = setTimeout(() => (el?.querySelector('[data-autofocus]') || first())?.focus({ preventScroll: true }), 60)
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose?.(); return }
      if (e.key !== 'Tab' || !el) return
      const f = [...el.querySelectorAll(sel)].filter((n) => n.offsetParent !== null)
      if (!f.length) return
      const a = f[0], z = f[f.length - 1]
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus() }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      if (prev && prev.focus) prev.focus({ preventScroll: true })
    }
  }, [active, ref, onClose])
}
