import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal, { Lines } from '../components/Reveal'
import Accordion, { AccordionItem } from '../components/Accordion'
import WaIcon from '../components/WaIcon'
import { faqs, waLink } from '../data/site'
import { useSeo } from '../lib/seo'
import './pages.css'

export default function Faq() {
  useSeo({
    title: 'FAQ',
    description: 'Answers to common questions about ordering, payment, delivery and returns at BMP Clothings, Lagos.',
    path: '/faq',
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faqs.flatMap((g) => g.items).map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a } })),
    },
  })
  return (
    <div>
      <Reveal className="wrap page-hero">
        <p className="index-label reveal">Help</p>
        <h1 className="display caps h-xl"><Lines lines={['Questions,', <em key="a">answered.</em>]} /></h1>
      </Reveal>
      <Reveal className="section section--tight wrap faq-grid">
        <aside className="faq-aside reveal">
          <p className="lede">Can't find what you need? Our team is one message away.</p>
          <a className="btn btn--glass" href={waLink('Hello BMP Clothings 👋 I have a question.')} target="_blank" rel="noopener noreferrer"><WaIcon /> Ask on WhatsApp</a>
          <Link to="/shipping" className="link-line">Shipping <ArrowRight className="arrow" size={13} /></Link>
          <Link to="/returns" className="link-line">Returns <ArrowRight className="arrow" size={13} /></Link>
        </aside>
        <div className="faq-groups">
          {faqs.map((g) => (
            <div key={g.group} className="faq-group reveal">
              <h2 className="eyebrow">{g.group}</h2>
              <Accordion>
                {g.items.map((q) => <AccordionItem key={q.q} title={q.q}><p>{q.a}</p></AccordionItem>)}
              </Accordion>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  )
}
