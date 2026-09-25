import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Img from '../components/Img'
import Reveal, { Lines } from '../components/Reveal'
import { pick, altText } from '../data/catalog'
import { naira } from '../lib/util'
import { useSeo } from '../lib/seo'
import './pages.css'

// Each chapter pairs looks that share a mood. Every piece appears once.
const CHAPTERS = [
  { no: '01', title: ['Gold', <em key="h">hour</em>], line: 'Metallics and bronze that glow when the lights come up.', looks: ['velvet-gold-cut-out-gown', 'bronze-draped-keyhole-gown', 'rust-ruched-wrap-maxi'] },
  { no: '02', title: ['Red', <em key="r">alert</em>], line: 'Every shade of red, cut to hold the room.', looks: ['red-cut-out-twist-maxi', 'red-twist-front-slit-maxi', 'red-ruched-tie-sleeve-mini', 'red-sweetheart-ruched-mini'] },
  { no: '03', title: ['Soft', <em key="p">power</em>], line: 'Ivory, white and whisper-light layers for the gentle entrance.', looks: ['white-halter-ruffle-gown', 'ivory-cowl-mermaid-gown', 'white-off-shoulder-drape-gown'] },
  { no: '04', title: ['Blue', <em key="m">mood</em>], line: 'Cobalt, royal and midnight. Cool colour, warm confidence.', looks: ['cobalt-draped-jumpsuit', 'royal-blue-plunge-maxi', 'midnight-cowl-mermaid-gown', 'cobalt-mesh-sleeve-draped-gown'] },
  { no: '05', title: ['Colour', <em key="c">theory</em>], line: 'Prints, fuchsia and sunshine for the days that deserve joy.', looks: ['fuchsia-print-mermaid-gown', 'blue-print-one-shoulder-maxi', 'colour-block-tiered-mini', 'fuchsia-off-shoulder-drape-gown'] },
]

export default function Lookbook() {
  useSeo({ title: 'Lookbook', description: 'The BMP Clothings lookbook: gold hour, red alert, soft power, blue mood and colour theory. Shop every look from our Lagos fashion house.', path: '/lookbook' })
  return (
    <div className="lookbook">
      <Reveal className="page-hero wrap">
        <p className="index-label reveal">BMP / Lookbook</p>
        <h1 className="display caps h-xxl"><Lines lines={['The', <em key="l">Lookbook</em>]} /></h1>
        <p className="lede reveal" data-delay="2">Five chapters, one woman. Scroll the moods, then shop the looks you can already see yourself in.</p>
      </Reveal>

      {CHAPTERS.map((ch, ci) => {
        const looks = pick(...ch.looks)
        return (
          <Reveal key={ch.no} className={`section chapter chapter--${ci % 2 ? 'b' : 'a'} wrap`} aria-labelledby={`ch-${ch.no}`}>
            <div className="chapter-head">
              <span className="chapter-no display">{ch.no}</span>
              <h2 id={`ch-${ch.no}`} className="display caps h-lg"><Lines lines={ch.title} /></h2>
              <p className="lede reveal" data-delay="2">{ch.line}</p>
            </div>
            <div className={`chapter-grid chapter-grid--${looks.length}`}>
              {looks.map((p, i) => (
                <Link key={p.slug} to={p.url} className={`look look--${i + 1} reveal`} data-delay={i + 1} data-cursor="Shop">
                  <div className="panel reveal-img"><Img id={p.images[0]} alt={altText(p)} sizes={i === 0 ? '(max-width: 760px) 100vw, 46vw' : '(max-width: 760px) 50vw, 26vw'} /></div>
                  <span className="look-cap">
                    <span>{p.title}</span>
                    <span className="price">{naira(p.price)}</span>
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        )
      })}

      <Reveal className="section wrap page-cta">
        <h2 className="display caps h-lg"><Lines lines={['Found', <em key="y">your look?</em>]} /></h2>
        <Link to="/shop" className="btn reveal">Shop every piece <ArrowRight className="arrow" size={15} /></Link>
      </Reveal>
    </div>
  )
}
