import { useEffect, useState } from 'react'
import { Check, ShoppingBag } from 'lucide-react'
import { useStore } from '../lib/store'

export default function AddToBag({ product, variant, qty = 1, disabled, disabledLabel = 'Choose an option', onAdded, className = '' }) {
  const { addToCart, openPanel } = useStore()
  const [added, setAdded] = useState(false)
  useEffect(() => {
    if (!added) return
    const t = setTimeout(() => setAdded(false), 1600)
    return () => clearTimeout(t)
  }, [added])

  return (
    <button
      type="button"
      className={`btn btn--block ${className}`}
      disabled={disabled}
      onClick={() => {
        addToCart(product.slug, variant, qty)
        setAdded(true)
        onAdded?.()
        setTimeout(() => openPanel('cart'), onAdded ? 450 : 650)
      }}
    >
      {added ? <><Check size={16} /> Added</> : disabled ? disabledLabel : <><ShoppingBag size={15} strokeWidth={1.7} /> Add to bag</>}
    </button>
  )
}
