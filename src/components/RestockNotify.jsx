import { useMemo } from 'react'
import { Check } from 'lucide-react'
import WaIcon from './WaIcon'
import { useStore } from '../lib/store'
import { newOrderRef, restockLink } from '../lib/order'

// Sold-out pieces hand off to WhatsApp with a parseable reference, so the owner can
// build a waiting list in the admin portal instead of losing the interest.
export default function RestockNotify({ product: p, className = '' }) {
  const { recordRestock, hasAskedRestock } = useStore()
  const asked = hasAskedRestock(p.slug)
  // Fixed per piece so the href is already correct before the click lands.
  const ref = useMemo(() => newOrderRef(), [p.slug])

  return (
    <a
      className={className}
      href={restockLink(p, ref)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => recordRestock(p.slug, ref)}
      aria-label={`Ask to be told when ${p.title} is back in stock`}
    >
      {asked ? <Check size={15} strokeWidth={2} /> : <WaIcon size={15} />}
      <span>{asked ? 'We will let you know' : 'Tell me when it is back'}</span>
    </a>
  )
}
