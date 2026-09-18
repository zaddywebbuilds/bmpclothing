import { useState } from 'react'
import { ArrowRight, ArrowUpRight, MapPin, Check } from 'lucide-react'
import Reveal, { Lines } from '../components/Reveal'
import WaIcon from '../components/WaIcon'
import { site, waLink } from '../data/site'
import { useSeo } from '../lib/seo'
import './pages.css'

export default function Contact() {
  useSeo({ title: 'Contact', description: 'Contact BMP Clothings in Lagos. Chat on WhatsApp 0901 962 4520 for orders, sizing, delivery and product questions.', path: '/contact' })
  const [f, setF] = useState({ name: '', email: '', phone: '', subject: 'Order enquiry', message: '' })
  const [err, setErr] = useState({})
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const errors = {}
    if (!f.name.trim()) errors.name = 'Please tell us your name.'
    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errors.email = 'Please check your email address.'
    if (!f.message.trim()) errors.message = 'Please write a short message.'
    setErr(errors)
    if (Object.keys(errors).length) return
    if (site.contactEndpoint) {
      const r = await fetch(site.contactEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(f) }).catch(() => null)
      if (r?.ok) { setSent(true); return }
    }
    const text = `Hello BMP Clothings 👋\n\n*${f.subject}*\n\n${f.message}\n\n──────────────────\nName: ${f.name}${f.email ? `\nEmail: ${f.email}` : ''}${f.phone ? `\nPhone: ${f.phone}` : ''}`
    window.open(waLink(text), '_blank', 'noopener')
    setSent(true)
  }

  return (
    <div>
      <Reveal className="wrap page-hero">
        <p className="index-label reveal">Contact</p>
        <h1 className="display caps h-xl"><Lines lines={["Let's talk", <em key="s">style.</em>]} /></h1>
        <p className="lede reveal" data-delay="2">Help with an order, product information, sizing, delivery or anything else. We usually respond quickly.</p>
      </Reveal>

      <Reveal className="section section--tight wrap contact-grid">
        <div className="contact-cards">
          <a className="contact-card glass reveal" href={waLink('Hello BMP Clothings 👋')} target="_blank" rel="noopener noreferrer">
            <WaIcon size={22} />
            <span className="eyebrow">WhatsApp · fastest</span>
            <strong className="display">{site.whatsapp.display}</strong>
            <span className="link-line">Start a chat <ArrowRight className="arrow" size={13} /></span>
          </a>
          {site.facebook && (
            <a className="contact-card glass reveal" data-delay="1" href={site.facebook} target="_blank" rel="noopener noreferrer">
              <ArrowUpRight size={22} strokeWidth={1.4} />
              <span className="eyebrow">Facebook</span>
              <strong className="display">BMP Clothings</strong>
              <span className="link-line">Follow along <ArrowRight className="arrow" size={13} /></span>
            </a>
          )}
          {site.email && (
            <a className="contact-card glass reveal" href={`mailto:${site.email}`}>
              <span className="eyebrow">Email</span>
              <strong className="display">{site.email}</strong>
            </a>
          )}
          <div className="contact-card glass reveal" data-delay="2">
            <MapPin size={22} strokeWidth={1.4} />
            <span className="eyebrow">Based in</span>
            <strong className="display">{site.location}</strong>
          </div>
        </div>

        <div className="contact-form glass reveal" data-delay="1">
          {sent ? (
            <div className="contact-sent">
              <Check size={28} />
              <h2 className="display h-sm">Message ready.</h2>
              <p className="lede">We opened WhatsApp with your message. Press send and we will reply as soon as we can.</p>
              <button className="btn btn--glass" onClick={() => setSent(false)}>Write another</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <h2 className="display h-sm">Send us a message</h2>
              <div className="form-row">
                <label className="field"><span>Name</span><input className="input" value={f.name} onChange={set('name')} autoComplete="name" aria-invalid={!!err.name} />{err.name && <em className="form-error">{err.name}</em>}</label>
                <label className="field"><span>Email</span><input className="input" type="email" value={f.email} onChange={set('email')} autoComplete="email" aria-invalid={!!err.email} />{err.email && <em className="form-error">{err.email}</em>}</label>
              </div>
              <div className="form-row">
                <label className="field"><span>Phone (optional)</span><input className="input" type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" /></label>
                <label className="field"><span>Subject</span>
                  <select className="input" value={f.subject} onChange={set('subject')}>
                    {['Order enquiry', 'Sizing help', 'Delivery question', 'Returns & exchanges', 'Something else'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
              </div>
              <label className="field"><span>Message</span><textarea className="input" value={f.message} onChange={set('message')} aria-invalid={!!err.message} />{err.message && <em className="form-error">{err.message}</em>}</label>
              <button className="btn" type="submit">Send via WhatsApp <ArrowRight className="arrow" size={15} /></button>
              <p className="form-note">Your message opens in WhatsApp so you can send it straight to our team.</p>
            </form>
          )}
        </div>
      </Reveal>
    </div>
  )
}
