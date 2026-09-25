import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react'
import Img from '../components/Img'
import Coverflow from '../components/Coverflow'
import Rail from '../components/Rail'
import ProductCard from '../components/ProductCard'
import Newsletter from '../components/Newsletter'
import WaIcon from '../components/WaIcon'
import Reveal, { Lines } from '../components/Reveal'
import { categories, categoryByKey, occasions, pick, picks, priceRange, productBySlug, products, altText } from '../data/catalog'
import { philosophy, pillars, testimonials, site, socials } from '../data/site'
import SocialIcon from '../components/SocialIcon'
import { naira, useScrollProgress } from '../lib/util'
import { orderLink } from '../lib/order'
import { useSeo } from '../lib/seo'
import './home.css'

// Each section draws from its own garments so no piece repeats down the page.
const HERO_RING = [
  'velvet-gold-cut-out-gown', 'white-halter-ruffle-gown', 'royal-blue-plunge-maxi',
  'fuchsia-print-mermaid-gown', 'midnight-cowl-mermaid-gown', 'red-cut-out-twist-maxi',
  'bronze-draped-keyhole-gown', 'turquoise-off-shoulder-ruched-maxi', 'cerise-rosette-mini-dress',
]
const CATEGORY_COVERS = {
  'long-gowns': 'ivory-cowl-mermaid-gown',
  'short-gowns': 'red-ruched-tie-sleeve-mini',
  jumpsuits: 'cobalt-draped-jumpsuit',
  'pants-and-tops': 'white-wide-leg-floral-bustier-set',
}
const NEW_ARRIVALS = ['ruched-cut-out-column-gown', 'white-off-shoulder-drape-gown', 'rust-ruched-wrap-maxi', 'black-lace-sleeve-ruched-mini', 'polka-dot-long-sleeve-maxi', 'blue-print-one-shoulder-maxi', 'violet-cut-out-jumpsuit', 'olive-ruched-bodycon-midi']
const STATEMENT = 'velvet-gold-cut-out-gown'
const BMP_WOMAN = ['white-off-shoulder-drape-gown', 'fuchsia-off-shoulder-drape-gown', 'midnight-cowl-mermaid-gown']
const OCCASION_COVERS = {
  'event-ready': 'fuchsia-off-shoulder-drape-gown',
  'dinner-date': 'black-lace-sleeve-ruched-mini',
  'main-character': 'white-ruffle-front-maxi',
  'sunday-best': 'turquoise-cut-out-pleated-maxi',
  weekend: 'colour-block-tiered-mini',
  'everyday-chic': 'red-keyhole-jumpsuit',
}
const THE_EDIT = ['cobalt-mesh-sleeve-draped-gown', 'red-twist-front-slit-maxi', 'tiered-strappy-midi-dress']
const QUALITY = 'turquoise-off-shoulder-ruched-maxi'
const STORE = 'violet-cut-out-jumpsuit'
const NEWSLETTER = 'red-ruched-tie-sleeve-mini'
const FINAL = 'red-sweetheart-ruched-mini'

export default function Home() {
  useSeo({
    description: 'BMP Clothings is a Lagos women’s fashion house. Shop statement long gowns, minis, jumpsuits and sets for confident women. Clear Naira prices and easy WhatsApp ordering.',
    path: '/',
  })
  return (
    <>
      <Hero />
      <Categories />
      <NewArrivals />
      <Statement />
      <BmpWomanScene />
      <Occasions />
      <TheEdit />
      <Picks />
      <Quality />
      <CustomerLove />
      <BehindBmp />
      <Circle />
      <FinalCta />
    </>
  )
}

/* ---------------------------------------------------------------
   Hero — a bento rail of live figures beside a 3D garment carousel
   --------------------------------------------------------------- */
function Hero() {
  const ring = pick(...HERO_RING)
  const [low, high] = priceRange()
  const liveCats = categories.filter((c) => c.count).length

  return (
    <Reveal className="hero wrap" aria-label="Introduction">
      <div className="hero-grid">
        <aside className="hero-rail" aria-label="BMP at a glance">
          <div className="bento hero-tile bento-in" style={{ animationDelay: '.05s' }}>
            <div className="stat">
              <span className="stat-k">{products.length}</span>
              <span className="stat-l">Pieces<br />in store</span>
            </div>
          </div>

          <div className="bento bento--frost hero-tile bento-in" style={{ animationDelay: '.14s' }}>
            <div className="stat">
              <span className="stat-l">Pieces from</span>
              <span className="stat-k">{naira(low).replace(',000', 'k')}</span>
              <span className="stat-bar" aria-hidden="true"><i style={{ width: '34%' }} /></span>
              <span className="stat-l" style={{ marginTop: 8 }}>up to {naira(high).replace(',000', 'k')}</span>
            </div>
          </div>

          <div className="bento bento--gold hero-tile hero-tile--wa bento-in" style={{ animationDelay: '.23s' }}>
            <div className="stat">
              <span className="hero-wa-ico" aria-hidden="true"><WaIcon size={18} /></span>
              <span className="stat-k" style={{ fontSize: 'clamp(22px,2vw,30px)' }}>Order on<br />WhatsApp</span>
              <span className="stat-l">{liveCats} collections · Lagos</span>
            </div>
          </div>
        </aside>

        <div className="stage hero-stage bento-in" style={{ animationDelay: '.1s' }}>
          <div className="hero-glow" aria-hidden="true" />
          <Coverflow items={ring} />

          <div className="hero-copy">
            <p className="index-label reveal">Lagos · Women's Fashion House</p>
            <h1 className="display caps h-xl hero-title">
              <Lines lines={['The', <em key="w">BMP</em>, 'Woman']} />
            </h1>
            <p className="hero-lede bento-in" style={{ animationDelay: '.46s' }}>
              <span className="hero-proof-ico" aria-hidden="true"><Sparkles size={13} strokeWidth={2} /></span>
              Style that speaks before you do. Statement gowns, sharp minis and sets for the woman who is comfortable being noticed.
            </p>
            <div className="hero-ctas bento-in" style={{ animationDelay: '.56s' }}>
              <Link to="/new-in" className="btn btn--disc">
                <span className="disc"><ArrowRight size={16} strokeWidth={2} /></span>
                Shop the edit
              </Link>
              <Link to="/the-bmp-woman" className="btn btn--glass">Explore BMP</Link>
            </div>
          </div>
        </div>
      </div>

      <a href="#collections" className="hero-scroll" aria-label="Scroll to collections"><ArrowDown size={16} strokeWidth={1.4} /></a>
    </Reveal>
  )
}

function Categories() {
  const cats = categories.filter((c) => c.count && CATEGORY_COVERS[c.key])
  return (
    <Reveal id="collections" className="section cats wrap" aria-labelledby="cats-title">
      <div className="section-head">
        <div>
          <p className="index-label reveal">BMP / 001</p>
          <h2 id="cats-title" className="display caps h-lg"><Lines lines={['Find your', <em key="s">silhouette</em>]} /></h2>
        </div>
        <Link to="/shop" className="link-line reveal">Shop all {products.length} pieces <ArrowRight className="arrow" size={14} /></Link>
      </div>
      <div className="cats-grid">
        {cats.map((c, i) => {
          const p = productBySlug[CATEGORY_COVERS[c.key]]
          if (!p) return null
          return (
            <Link key={c.key} to={`/collections/${c.key}`} className={`cat reveal`} data-delay={(i % 3) + 1} data-cursor="Shop">
              <div className="panel cat-img tilt">
                <Img id={p.images[0]} alt={`${c.name} at BMP Clothings: ${p.title}`} sizes="(max-width: 760px) 50vw, 25vw" />
                <span className="tilt-sheen" aria-hidden="true" />
              </div>
              <div className="cat-label">
                <span className="cat-name">{c.name}</span>
                <span className="cat-count">{c.count}</span>
                <ArrowUpRight className="cat-arrow" size={16} strokeWidth={1.5} />
              </div>
            </Link>
          )
        })}
      </div>
    </Reveal>
  )
}

function NewArrivals() {
  return (
    <Reveal className="section section--tight arrivals" aria-labelledby="new-title">
      <div className="wrap section-head">
        <div>
          <p className="index-label reveal">New arrival / {String(NEW_ARRIVALS.length).padStart(2, '0')}</p>
          <h2 id="new-title" className="display caps h-lg"><Lines lines={['New', <em key="a">Arrivals</em>]} /></h2>
        </div>
        <div className="reveal arrivals-side">
          <p className="lede">Fresh from the BMP store. Just in and ready to be worn.</p>
          <Link to="/new-in" className="link-line">View all new in <ArrowRight className="arrow" size={14} /></Link>
        </div>
      </div>
      <div className="reveal"><Rail items={pick(...NEW_ARRIVALS)} label="New arrivals" /></div>
    </Reveal>
  )
}

function Statement() {
  const p = productBySlug[STATEMENT]
  const ref = useRef(null)
  const prog = useScrollProgress(ref)
  if (!p) return null
  return (
    <Reveal className="section statement" aria-label="Not just an outfit, a whole presence">
      <div ref={ref} className="wrap statement-inner">
        <h2 className="display caps statement-type statement-back">
          <Lines lines={['Not just', 'an outfit.']} />
        </h2>
        <Link to={p.url} className="statement-figure" style={{ transform: `translate3d(0, ${(0.5 - prog) * 80}px, 0)` }} data-cursor="View">
          <div className="panel statement-img reveal-img">
            <Img id={p.images[0]} alt={altText(p)} sizes="(max-width: 760px) 70vw, 30vw" />
          </div>
          <span className="statement-cap glass">
            <span>{p.title}</span><span className="price">{naira(p.price)}</span>
          </span>
        </Link>
        <p className="display caps statement-type statement-front" aria-hidden="true">
          <Lines lines={[<em key="a">A whole</em>, 'presence.']} />
        </p>
        <span className="sr-only">A whole presence.</span>
      </div>
    </Reveal>
  )
}

function BmpWomanScene() {
  const ref = useRef(null)
  const prog = useScrollProgress(ref, { start: 'bottom', end: 'bottom' })
  const [a, b, c] = pick(...BMP_WOMAN)
  const step = (t) => Math.max(0, Math.min(1, (prog - t) / 0.22))
  return (
    <section ref={ref} className="wrap bmpw-wrap" aria-labelledby="bmpw-title">
      <Reveal as="div" className="surface-dark bmpw">
        <div className="bmpw-copy">
          <p className="index-label reveal">The signature</p>
          <h2 id="bmpw-title" className="display caps h-xl bmpw-title" style={{ transform: `translateX(${(prog - 0.5) * -24}px)` }}>
            <Lines lines={['If you see', 'BMP Woman,', <em key="k">you go know.</em>]} />
          </h2>
          <p className="lede reveal" data-delay="3">Confidence has a look. It walks in before she does, and nobody has to ask where it came from.</p>
          <div className="reveal" data-delay="4">
            <Link to="/the-bmp-woman" className="btn btn--light">Meet the collection <ArrowRight className="arrow" size={15} /></Link>
          </div>
        </div>
        <div className="bmpw-stack scene">
          {[a, b, c].filter(Boolean).map((p, i) => {
            const t = [0.05, 0.2, 0.36][i]
            const rot = [-4, 3, -1.5][i]
            return (
              <Link
                key={p.slug}
                to={p.url}
                className={`panel bmpw-card bmpw-card--${i + 1}`}
                style={{ opacity: i === 0 ? 0.4 + step(t) * 0.6 : step(t), transform: `translate3d(0, ${(1 - step(t)) * (40 + i * 25)}px, 0) rotate(${rot}deg)` }}
                data-cursor="View"
              >
                <Img id={p.images[0]} alt={altText(p)} sizes="(max-width: 900px) 55vw, 22vw" />
              </Link>
            )
          })}
        </div>
      </Reveal>
    </section>
  )
}

function Occasions() {
  const [active, setActive] = useState(occasions[0].key)
  const current = productBySlug[OCCASION_COVERS[active]]
  return (
    <Reveal className="section occasions wrap" aria-labelledby="occ-title">
      <div className="occ-grid">
        <div className="occ-list">
          <p className="index-label reveal">Shop by occasion</p>
          <h2 id="occ-title" className="sr-only">Shop by occasion</h2>
          <ul>
            {occasions.map((o, i) => {
              const p = productBySlug[OCCASION_COVERS[o.key]]
              return (
                <li key={o.key} className="reveal" data-delay={Math.min(i + 1, 5)}>
                  <Link
                    to={`/occasion/${o.key}`}
                    className={`occ-item ${active === o.key ? 'is-active' : ''}`}
                    onMouseEnter={() => setActive(o.key)}
                    onFocus={() => setActive(o.key)}
                  >
                    <span className="occ-num">0{i + 1}</span>
                    <span className="occ-name display">{o.name}</span>
                    <span className="occ-line">{o.line}</span>
                    {p && <div className="panel occ-thumb"><Img id={p.images[0]} alt="" sizes="40vw" /></div>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="occ-stage reveal" aria-hidden="true">
          {occasions.map((o) => {
            const p = productBySlug[OCCASION_COVERS[o.key]]
            if (!p) return null
            return (
              <div key={o.key} className={`panel occ-preview ${active === o.key ? 'is-active' : ''}`}>
                <Img id={p.images[0]} alt="" sizes="36vw" />
              </div>
            )
          })}
          {current && (
            <div className="occ-tagline glass">
              <span className="eyebrow">Styled for {occasions.find((o) => o.key === active).name}</span>
              <strong>{current.title}</strong>
              <span className="price">{naira(current.price)}</span>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  )
}

function TheEdit() {
  const [a, b, c] = pick(...THE_EDIT)
  if (!a) return null
  return (
    <Reveal className="section edit wrap" aria-labelledby="edit-title">
      <Link to={a.url} className="edit-a" data-cursor="View">
        <div className="panel reveal-img"><Img id={a.images[0]} alt={altText(a)} sizes="(max-width: 760px) 100vw, 44vw" /></div>
      </Link>
      <div className="edit-copy">
        <p className="index-label reveal">The Edit / 01</p>
        <h2 id="edit-title" className="display caps h-lg"><Lines lines={['Confidence', <em key="m">in motion</em>]} /></h2>
        <p className="lede reveal" data-delay="2">Mesh sleeves that catch the light, twists that hold the waist, tiers that swing when you walk. Three pieces, one mood.</p>
        <Link to="/lookbook" className="btn btn--glass reveal" data-delay="3">Explore the lookbook <ArrowRight className="arrow" size={15} /></Link>
      </div>
      {b && (
        <Link to={b.url} className="edit-b" data-cursor="View">
          <div className="panel reveal-img"><Img id={b.images[0]} alt={altText(b)} sizes="(max-width: 760px) 60vw, 24vw" /></div>
          <span className="edit-cap">{b.title} · <span className="price">{naira(b.price)}</span></span>
        </Link>
      )}
      {c && (
        <Link to={c.url} className="edit-c" data-cursor="View">
          <div className="panel reveal-img"><Img id={c.images[1] || c.images[0]} alt={altText(c, 1)} sizes="(max-width: 760px) 60vw, 22vw" /></div>
          <span className="edit-cap">{c.title} · <span className="price">{naira(c.price)}</span></span>
        </Link>
      )}
    </Reveal>
  )
}

function Picks() {
  if (!picks.length) return null
  return (
    <Reveal className="section section--tight picks wrap" aria-labelledby="picks-title">
      <div className="section-head">
        <div>
          <p className="index-label reveal">Chosen by BMP</p>
          <h2 id="picks-title" className="display caps h-lg"><Lines lines={['BMP', <em key="p">Picks</em>]} /></h2>
        </div>
        <Link to="/shop?view=picks" className="link-line reveal">See every pick <ArrowRight className="arrow" size={14} /></Link>
      </div>
      <div className="grid-products">
        {picks.map((p, i) => (
          <div key={p.slug} className="reveal" data-delay={(i % 4) + 1}><ProductCard product={p} /></div>
        ))}
      </div>
    </Reveal>
  )
}

function Quality() {
  const p = productBySlug[QUALITY]
  return (
    <Reveal className="section quality wrap" aria-labelledby="quality-title">
      <div className="quality-head">
        <h2 id="quality-title" className="display caps h-xl">
          <Lines lines={[site.taglines.quality[0]]} />
          <Lines className="is-italic" lines={[<em key="s">{site.taglines.quality[1]}</em>]} />
        </h2>
      </div>
      <div className="quality-body">
        {p && (
          <Link to={p.url} className="panel quality-img reveal-img" data-cursor="View">
            <Img id={p.images[0]} alt={altText(p)} sizes="(max-width: 900px) 80vw, 30vw" />
          </Link>
        )}
        <div className="quality-text">
          <p className="quality-philosophy display reveal">{philosophy}</p>
          <ol className="quality-list">
            {pillars.map((pl, i) => (
              <li key={pl.title} className="reveal" data-delay={i + 1}>
                <span className="occ-num">0{i + 1}</span>
                <div><h3>{pl.title}</h3><p>{pl.body}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Reveal>
  )
}

function CustomerLove() {
  const t = testimonials[0]
  if (!t) return null
  return (
    <Reveal className="section section--tight love wrap" aria-labelledby="love-title">
      <div className="love-card bento">
        <div className="love-copy">
          <p className="index-label reveal">Worn. Loved. Repeated.</p>
          <h2 id="love-title" className="sr-only">Customer love</h2>
          <blockquote className="display love-quote reveal" data-delay="1">“{t.quote}”</blockquote>
          <p className="love-who reveal" data-delay="2"><strong>{t.name}</strong> · {t.location} · <em>{t.tag}</em></p>
          <div className="love-actions reveal" data-delay="3">
            <a className="link-line" href={`https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent('Hello BMP Clothings 👋 I want to share my BMP look!')}`} target="_blank" rel="noopener noreferrer">
              Share your BMP look <ArrowRight className="arrow" size={14} />
            </a>
            <div className="love-follow">
              {socials().filter(([n]) => n !== 'Facebook').map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="chip"><SocialIcon name={name} size={14} /> {site.handle}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

function BehindBmp() {
  const p = productBySlug[STORE]
  return (
    <Reveal className="section behind wrap" aria-labelledby="behind-title">
      {p && (
        <div className="panel behind-img reveal-img">
          <Img id={p.images[0]} alt={altText(p)} sizes="(max-width: 900px) 90vw, 40vw" />
        </div>
      )}
      <div className="behind-copy">
        <p className="index-label reveal">Behind BMP</p>
        <h2 id="behind-title" className="display caps h-md"><Lines lines={['Made in Nigeria.', <em key="f">Made to be felt.</em>]} /></h2>
        <p className="lede reveal" data-delay="2">At BMP, fashion is self-expression. Nigerian-made, ready-to-wear and styled in our Lagos store, every piece is chosen with care so you can move through your day with confidence, comfort and a touch of glamour.</p>
        <Link to="/about" className="link-line reveal" data-delay="3">Our story <ArrowRight className="arrow" size={14} /></Link>
      </div>
    </Reveal>
  )
}

function Circle() {
  const p = productBySlug[NEWSLETTER]
  return (
    <Reveal className="section section--tight wrap" aria-labelledby="circle-title">
      <div className="circle bento">
        <div className="circle-copy">
          <p className="index-label reveal">The BMP Circle</p>
          <h2 id="circle-title" className="display caps h-lg"><Lines lines={['Join the', <em key="c">BMP Circle</em>]} /></h2>
          <p className="lede reveal" data-delay="2">Be first to discover new drops, fresh edits and BMP favourites.</p>
          <div className="reveal" data-delay="3"><Newsletter /></div>
        </div>
        {p && (
          <Link to={p.url} className="panel circle-img reveal-img" data-cursor="View">
            <Img id={p.images[0]} alt={altText(p)} sizes="(max-width: 900px) 60vw, 26vw" />
          </Link>
        )}
      </div>
    </Reveal>
  )
}

function FinalCta() {
  const p = productBySlug[FINAL]
  return (
    <Reveal className="section final wrap" aria-labelledby="final-title">
      <h2 id="final-title" className="display caps h-xl final-title"><Lines lines={['Your next', 'look is', <em key="w">waiting.</em>]} /></h2>
      <div className="final-side">
        {p && (
          <Link to={p.url} className="panel final-img reveal-img" data-cursor="View">
            <Img id={p.images[0]} alt={altText(p)} sizes="(max-width: 760px) 70vw, 28vw" />
          </Link>
        )}
        <div className="final-actions reveal" data-delay="2">
          <Link to="/shop" className="btn">Shop BMP <ArrowRight className="arrow" size={15} /></Link>
          {p && (
            <a className="btn btn--glass" href={orderLink(p)} target="_blank" rel="noopener noreferrer">
              <WaIcon /> Order the {categoryByKey[p.category].name.replace(/s$/, '')}
            </a>
          )}
        </div>
      </div>
    </Reveal>
  )
}
