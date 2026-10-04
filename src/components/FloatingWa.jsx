import { useEffect, useState } from 'react'
import WaIcon from './WaIcon'
import { waLink } from '../data/site'
import './floating-wa.css'

// Desktop-only companion to MobileBar, which already carries WhatsApp below 900px.
// Appears after a short scroll so it never covers the hero on first paint.
export default function FloatingWa() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      className={`fwa ${shown ? 'is-shown' : ''}`}
      href={waLink('Hello BMP Collections 👋')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with BMP Collections on WhatsApp"
    >
      <WaIcon size={21} />
      <span className="fwa-label">Chat with us</span>
    </a>
  )
}
