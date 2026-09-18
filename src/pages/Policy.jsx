import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal, { Lines } from '../components/Reveal'
import WaIcon from '../components/WaIcon'
import { shipping, returns, waLink } from '../data/site'
import { useSeo } from '../lib/seo'
import './pages.css'

const PAGES = {
  shipping: {
    title: 'Shipping', h: ['Getting it', <em key="t">to you.</em>], intro: 'Everything you need to know about getting your order.', items: shipping,
    desc: 'BMP Clothings shipping information: order processing, delivery time, delivery charges and order tracking.',
    other: ['/returns', 'Returns & exchanges'],
  },
  returns: {
    title: 'Returns & Exchanges', h: ['Simple,', <em key="f">fair returns.</em>], intro: 'Simple, fair and hassle-free.', items: returns,
    desc: 'BMP Clothings returns and exchanges: eligibility, item condition, how to request a return and approval.',
    other: ['/shipping', 'Shipping information'],
  },
}

export default function Policy({ kind }) {
  const pg = PAGES[kind]
  useSeo({ title: pg.title, description: pg.desc, path: `/${kind}` })
  return (
    <div>
      <Reveal className="wrap page-hero">
        <p className="index-label reveal">{pg.title}</p>
        <h1 className="display caps h-xl"><Lines lines={pg.h} /></h1>
        <p className="lede reveal" data-delay="2">{pg.intro}</p>
      </Reveal>
      <Reveal className="section section--tight wrap">
        <ol className="policy-list">
          {pg.items.map((it, i) => (
            <li key={it.title} className="policy-item glass reveal" data-delay={i + 1}>
              <span className="policy-no display">0{i + 1}</span>
              <div>
                <h2 className="display h-sm">{it.title}</h2>
                <p>{it.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="page-actions reveal">
          <a className="btn" href={waLink(`Hello BMP Clothings 👋 I have a question about ${kind}.`)} target="_blank" rel="noopener noreferrer"><WaIcon /> Chat with us</a>
          <Link to={pg.other[0]} className="link-line">{pg.other[1]} <ArrowRight className="arrow" size={13} /></Link>
        </div>
      </Reveal>
    </div>
  )
}
