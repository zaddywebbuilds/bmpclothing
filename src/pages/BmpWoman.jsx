import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Img from '../components/Img'
import HeroVideo from '../components/HeroVideo'
import ProductCard from '../components/ProductCard'
import Reveal, { Lines } from '../components/Reveal'
import { pick, altText, worn } from '../data/catalog'
import { site } from '../data/site'
import { useSeo } from '../lib/seo'
import './pages.css'

const TRAITS = [
  ['Confident', 'She walks in like she was expected.'],
  ['Expressive', 'Colour, cut and drape are her vocabulary.'],
  ['Modern', 'Lagos energy with a global point of view.'],
  ['Unforgettable', 'People remember the dress, then they remember her.'],
]
const HER_PIECES = ['bmp-lg-1', 'ruched-cut-out-column-gown', 'cerise-rosette-mini-dress', 'bmp-pt-2']

export default function BmpWoman() {
  useSeo({ title: 'The BMP Woman', description: 'If you see BMP Woman, you go know. Meet the confident, expressive Lagos woman behind every BMP Clothings piece.', path: '/the-bmp-woman' })
  const pieces = pick(...HER_PIECES)
  return (
    <div className="bmpw-page">
      <Reveal className="wrap page-hero page-hero--split">
        <div>
          <p className="index-label reveal">The signature</p>
          <h1 className="display caps h-xl"><Lines lines={['If you see', 'BMP Woman,', <em key="k">you go know.</em>]} /></h1>
          <p className="lede reveal" data-delay="3">She is not dressing for approval. She is dressing for the moment, and the moment always notices.</p>
        </div>
        <div className="panel page-hero-media reveal-img" style={{ aspectRatio: '752 / 416' }}><HeroVideo /></div>
      </Reveal>

      <Reveal className="section wrap traits">
        {TRAITS.map(([t, l], i) => (
          <div key={t} className="trait reveal" data-delay={i + 1}>
            <span className="occ-num">0{i + 1}</span>
            <h2 className="display h-md">{t}</h2>
            <p>{l}</p>
          </div>
        ))}
      </Reveal>

      <Reveal className="wrap">
        <div className="surface-dark manifesto on-dark">
          <div className="panel manifesto-img reveal-img"><Img id="brand/campaign-magenta-cowl" alt="BMP campaign portrait in a magenta cowl gown" sizes="(max-width: 900px) 80vw, 34vw" /></div>
          <div className="manifesto-copy">
            <p className="index-label reveal">Manifesto</p>
            <p className="display manifesto-text reveal">{site.taglines.quality[0]} <em>{site.taglines.quality[1]}</em> Fashion is self-expression, and every BMP piece is chosen so you can move through your day with confidence, comfort and a touch of glamour.</p>
          </div>
        </div>
      </Reveal>

      <Reveal className="section wrap">
        <div className="section-head">
          <h2 className="display caps h-lg"><Lines lines={['Her', <em key="w">wardrobe</em>]} /></h2>
          <Link to="/shop" className="link-line reveal">Shop all <ArrowRight className="arrow" size={14} /></Link>
        </div>
        <div className="grid-products">
          {pieces.map((p, i) => <div key={p.slug} className="reveal" data-delay={i + 1}><ProductCard product={p} /></div>)}
        </div>
      </Reveal>

      <Reveal className="section section--tight wrap">
        <div className="section-head">
          <h2 className="display caps h-lg"><Lines lines={['She wears', <em key="b">BMP</em>]} /></h2>
          <p className="lede reveal">Real BMP women, photographed after their orders arrived.</p>
        </div>
        <div className="worn-strip">
          {worn.filter((p) => !['bmp-t-17', 'bmp-t-16', 'bmp-t-12', 'bmp-t-9', 'bmp-t-6', 'bmp-t-5', 'bmp-t-4', 'bmp-t-15'].includes(p.slug)).map((p, i) => (
            <Link key={p.slug} to={p.url} className="worn-item reveal" data-delay={(i % 4) + 1} data-cursor="View">
              <div className="panel"><Img id={p.images[0]} alt={altText(p)} sizes="(max-width: 760px) 45vw, 20vw" /></div>
            </Link>
          ))}
        </div>
      </Reveal>
    </div>
  )
}
