import { Link } from 'react-router-dom'
import { Minus, Plus, ArrowRight } from 'lucide-react'
import Drawer from './Drawer'
import Img from './Img'
import { useStore } from '../lib/store'
import { naira } from '../lib/util'
import { checkoutLink } from '../lib/order'
import { newIn } from '../data/catalog'

export function CartLines({ compact }) {
  const { lines, setQty, removeLine } = useStore()
  return (
    <ul className={`cart-lines ${compact ? 'is-compact' : ''}`}>
      {lines.map((l) => (
        <li key={l.id} className="cart-line">
          <Link to={l.product.url} className="panel cart-thumb">
            <Img id={l.product.images[0]} alt={l.product.title} sizes="96px" />
          </Link>
          <div className="cart-line-body">
            <div className="cart-line-top">
              <div>
                <Link to={l.product.url} className="cart-line-title">{l.product.title}</Link>
                <p className="cart-line-meta">{[l.product.code, l.variant].filter(Boolean).join(' · ')}</p>
              </div>
              <span className="price">{naira(l.product.price * l.qty)}</span>
            </div>
            <div className="cart-line-bottom">
              <div className="qty" role="group" aria-label={`Quantity for ${l.product.title}`}>
                <button onClick={() => setQty(l.id, l.qty - 1)} aria-label="Decrease quantity"><Minus size={13} /></button>
                <span aria-live="polite">{l.qty}</span>
                <button onClick={() => setQty(l.id, l.qty + 1)} aria-label="Increase quantity"><Plus size={13} /></button>
              </div>
              <button className="cart-remove" onClick={() => removeLine(l.id)}>Remove</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function CartDrawer() {
  const { panel, closePanel, lines, subtotal, count } = useStore()
  const open = panel === 'cart'
  const suggestion = newIn[0]

  return (
    <Drawer
      open={open}
      onClose={closePanel}
      label="Shopping bag"
      className="cart"
      title={<><span className="display h-sm">Your Bag</span> <span className="eyebrow">({count})</span></>}
    >
      {lines.length === 0 ? (
        <div className="cart-empty">
          <p className="lede">Your bag is waiting for its first BMP piece.</p>
          <Link to="/new-in" className="btn" onClick={closePanel}>Shop new in <ArrowRight className="arrow" size={15} /></Link>
          {suggestion && (
            <Link to={suggestion.url} className="cart-suggest" onClick={closePanel}>
              <div className="panel"><Img id={suggestion.images[0]} alt={suggestion.title} sizes="120px" /></div>
              <div><span className="eyebrow">Just in</span><strong>{suggestion.title}</strong><span className="price">{naira(suggestion.price)}</span></div>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="ov-body"><CartLines /></div>
          <div className="cart-foot">
            <div className="cart-total"><span>Subtotal</span><span className="price">{naira(subtotal)}</span></div>
            <p className="form-note">Delivery is calculated for your location and confirmed with you before payment.</p>
            <a className="btn btn--block" href={checkoutLink(lines, subtotal)} target="_blank" rel="noopener noreferrer">
              Checkout on WhatsApp <ArrowRight className="arrow" size={15} />
            </a>
            <Link to="/bag" className="btn btn--glass btn--block" onClick={closePanel}>View bag</Link>
          </div>
        </>
      )}
    </Drawer>
  )
}
