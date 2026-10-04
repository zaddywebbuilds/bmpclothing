import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'
import { site } from '../data/site'
import { naira } from '../lib/util'
import './share-button.css'

// Mobile opens the native sheet, which is where WhatsApp lives for most shoppers here.
// Desktop has no sheet, so it copies the link instead.
export default function ShareButton({ product: p, className = '' }) {
  const [state, setState] = useState(null) // 'copied' | 'failed' | null
  const url = `${site.url}/product/${p.slug}`

  // The clipboard API throws when the document is not focused or permission is refused,
  // so a selection-based copy backs it up. Without one the button looks dead on click.
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      return true
    } catch { /* fall through */ }
    try {
      const el = document.createElement('textarea')
      el.value = url
      el.setAttribute('readonly', '')
      el.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
      document.body.appendChild(el)
      el.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(el)
      return ok
    } catch {
      return false
    }
  }

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: p.title, text: `${p.title} — ${naira(p.price)} at BMP Collections`, url })
        return
      } catch {
        return // sheet dismissed; copying behind their back would be a surprise
      }
    }
    setState(await copy() ? 'copied' : 'failed')
    setTimeout(() => setState(null), 2400)
  }

  return (
    <button type="button" className={`sharebtn ${className}`} onClick={share} aria-label={`Share ${p.title}`}>
      {state === 'copied' ? <Check size={15} strokeWidth={2} /> : <Share2 size={15} strokeWidth={1.6} />}
      <span aria-live="polite">
        {state === 'copied' ? 'Link copied' : state === 'failed' ? 'Press Ctrl+C to copy' : 'Share this piece'}
      </span>
    </button>
  )
}
