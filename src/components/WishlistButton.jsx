import { Heart } from 'lucide-react'
import { useStore } from '../lib/store'

export default function WishlistButton({ slug, className = '', withLabel = false }) {
  const { isWished, toggleWish } = useStore()
  const on = isWished(slug)
  return (
    <button
      type="button"
      className={`wish ${on ? 'is-on' : ''} ${className}`}
      aria-pressed={on}
      aria-label={on ? 'Remove from wishlist' : 'Save to wishlist'}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWish(slug) }}
    >
      <Heart size={16} strokeWidth={1.6} />
      {withLabel && <span>{on ? 'Saved' : 'Save'}</span>}
    </button>
  )
}
