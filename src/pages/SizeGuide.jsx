import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal, { Lines } from '../components/Reveal'
import SizeFinder, { SizeTable } from '../components/SizeFinder'
import WaIcon from '../components/WaIcon'
import { waLink } from '../data/site'
import { SIZE_CHART } from '../data/sizes'
import { useSeo } from '../lib/seo'
import './pages.css'
import '../components/size.css'

const STEPS = [
  ['Bust', 'Wrap the tape around the fullest part of your bust, under your arms, keeping it level across your back.'],
  ['Waist', 'Measure around your natural waist, the narrowest part of your torso, usually just above the belly button.'],
  ['Hip', 'Stand with feet together and measure around the fullest part of your hips and bum.'],
]

export default function SizeGuide() {
  useSeo({
    title: 'Size Guide & Find My Size',
    description: `BMP Clothings size guide: UK sizes ${SIZE_CHART[0].size} to ${SIZE_CHART[SIZE_CHART.length - 1].size} with bust, waist and hip measurements in inches and cm. Enter your measurements to find your BMP size instantly.`,
    path: '/size-guide',
  })
  return (
    <div>
      <Reveal className="wrap page-hero">
        <p className="index-label reveal">Size guide</p>
        <h1 className="display caps h-xl"><Lines lines={['Your perfect', <em key="f">BMP fit.</em>]} /></h1>
        <p className="lede reveal" data-delay="2">Enter your measurements and we will tell you your BMP size in seconds. Your size is remembered, so every piece you open is ready in your size.</p>
      </Reveal>

      <Reveal className="section section--tight wrap sg-grid">
        <div className="glass sg-finder reveal"><SizeFinder /></div>
        <div className="sg-side">
          <h2 className="display h-sm reveal">Size chart</h2>
          <div className="reveal" data-delay="1"><SizeTable /></div>
          <h2 className="display h-sm reveal sg-how">How to measure</h2>
          <ol className="sg-steps">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="glass reveal" data-delay={i + 1}>
                <span className="occ-num">0{i + 1}</span>
                <div><h3>{t}</h3><p>{d}</p></div>
              </li>
            ))}
          </ol>
          <div className="page-actions reveal">
            <a className="btn btn--glass" href={waLink('Hello BMP Clothings 👋 Please help me find my size.')} target="_blank" rel="noopener noreferrer"><WaIcon /> Ask us on WhatsApp</a>
            <Link to="/shop" className="link-line">Shop in your size <ArrowRight className="arrow" size={13} /></Link>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
