import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Drawer from './Drawer'
import Img from './Img'
import OptionPicker, { useOptions } from './OptionPicker'
import AddToBag from './AddToBag'
import WaIcon from './WaIcon'
import { useStore } from '../lib/store'
import { productBySlug, altText } from '../data/catalog'
import { naira } from '../lib/util'
import { orderLink } from '../lib/order'

export default function QuickView() {
  const { quickView, closeQuickView } = useStore()
  const [last, setLast] = useState(null)
  useEffect(() => { if (quickView) setLast(quickView) }, [quickView])
  const p = productBySlug[quickView || last]
  const opts = useOptions(p)

  return (
    <Drawer open={Boolean(quickView)} onClose={closeQuickView} label={p ? `Quick view: ${p.title}` : 'Quick view'} side="center" className="qv" title="">
      {p && (
        <div className="qv-grid">
          <div className="panel qv-img">
            <Img id={opts.image || p.images[0]} alt={altText(p)} sizes="(max-width: 760px) 90vw, 420px" />
          </div>
          <div className="qv-info">
            {p.code && <span className="eyebrow">{p.code}</span>}
            <h2 className="display h-sm">{p.title}</h2>
            <p className="price qv-price">{naira(p.price)}</p>
            <p className="lede">{p.description}</p>
            <OptionPicker product={p} opts={opts} finder={false} />
            <AddToBag product={p} variant={opts.label} disabled={!opts.ready} disabledLabel={opts.needColour && !opts.colour ? 'Choose colour' : 'Choose size'} onAdded={closeQuickView} />
            <a className="btn btn--glass btn--block" href={orderLink(p, { variant: opts.label })} target="_blank" rel="noopener noreferrer">
              <WaIcon /> Order on WhatsApp
            </a>
            <Link to={p.url} className="link-line" onClick={closeQuickView}>View full details <ArrowRight className="arrow" size={14} /></Link>
          </div>
        </div>
      )}
    </Drawer>
  )
}
