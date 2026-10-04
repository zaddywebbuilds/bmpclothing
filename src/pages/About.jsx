import { Link } from 'react-router-dom'
import { ArrowRight, Quote } from 'lucide-react'
import Img from '../components/Img'
import Reveal, { Lines } from '../components/Reveal'
import WaIcon from '../components/WaIcon'
import { productBySlug, products, listedCategories } from '../data/catalog'
import { about, philosophy, pillars, site, testimonials, waLink } from '../data/site'
import { useSeo } from '../lib/seo'
import './pages.css'

export default function About() {
  useSeo({ title: 'About BMP', description: 'The story behind BMP Collections, a Lagos women’s fashion house built on self-expression, quality you can see and style you can feel.', path: '/about' })
  const hero = productBySlug['white-halter-ruffle-gown']
  const detail = productBySlug['tiered-strappy-midi-dress']
  return (
    <div>
      <Reveal className="wrap page-hero page-hero--split">
        <div>
          <p className="index-label reveal">About BMP</p>
          <h1 className="display caps h-xl"><Lines lines={['The story', <em key="b">behind BMP</em>]} /></h1>
          <p className="lede reveal" data-delay="3">{about[0]}</p>
        </div>
        <div className="panel page-hero-media reveal-img"><Img id={hero.images[0]} alt={`BMP Collections: ${hero.title}`} priority sizes="(max-width: 900px) 90vw, 40vw" /></div>
      </Reveal>

      <Reveal className="section wrap about-grid">
        <div className="panel about-img reveal-img"><img src="/assets/bmp/brand/storefront.jpg" alt="BMP Collections store at No 2 Onabanjo Street, Oworoshoki, Lagos" style={{width:'100%',height:'100%',objectFit:'cover'}} /></div>
        <div className="about-copy">
          <p className="display about-big reveal">{philosophy}</p>
          {about.slice(1).map((t, i) => <p key={i} className="lede reveal" data-delay={i + 1}>{t}</p>)}
          <ul className="about-stats reveal" data-delay="3">
            <li><strong>{products.length}</strong><span>pieces in store</span></li>
            <li><strong>{listedCategories.length}</strong><span>collections</span></li>
            <li><strong>Lagos</strong><span>home of BMP</span></li>
          </ul>
        </div>
      </Reveal>

      <Reveal className="section section--tight wrap">
        <h2 className="display caps h-lg"><Lines lines={['Quality you can see.', <em key="s">Style you can feel.</em>]} /></h2>
        <ol className="quality-list about-pillars">
          {pillars.map((p, i) => (
            <li key={p.title} className="reveal" data-delay={i + 1}>
              <span className="occ-num">0{i + 1}</span>
              <div><h3>{p.title}</h3><p>{p.body}</p></div>
            </li>
          ))}
        </ol>
      </Reveal>

      {testimonials.length > 0 && (
        <Reveal className="section section--tight wrap about-quotes" aria-label="What customers say">
          {testimonials.map((t) => (
            <figure key={t.name} className="quote-card glass reveal">
              <Quote size={22} strokeWidth={1.4} aria-hidden="true" />
              <blockquote className="display quote-body">{t.quote}</blockquote>
              <figcaption>
                <strong>{t.name}</strong>
                <span>{t.location}</span>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      )}

      <Reveal className="section wrap about-end">
        <div className="panel about-end-img reveal-img"><Img id={detail.images[0]} alt="BMP Collections dresses in store" sizes="(max-width: 900px) 70vw, 26vw" /></div>
        <div className="about-end-copy">
          <h2 className="display caps h-md"><Lines lines={['Thank you for', <em key="c">choosing BMP.</em>]} /></h2>
          <p className="lede reveal">We appreciate your support and look forward to dressing you for your next moment.</p>
          <div className="page-actions reveal">
            <Link to="/shop" className="btn">Shop BMP <ArrowRight className="arrow" size={15} /></Link>
            <a className="btn btn--glass" href={waLink('Hello BMP Collections 👋')} target="_blank" rel="noopener noreferrer"><WaIcon /> {site.whatsapp.display}</a>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
