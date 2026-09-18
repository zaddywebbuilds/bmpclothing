import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { site, waLink } from '../data/site'

export default function Newsletter({ compact = false }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address.'); return }
    setError('')
    if (site.newsletterEndpoint) {
      setState('sending')
      try {
        const r = await fetch(site.newsletterEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ email }) })
        setState(r.ok ? 'done' : 'error')
      } catch { setState('error') }
      return
    }
    window.open(waLink(`Hello BMP Clothings 👋\n\nPlease add me to the BMP Circle for new drops and edits.\nEmail: ${email}`), '_blank', 'noopener')
    setState('done')
  }

  if (state === 'done') {
    return <p className="nl-done"><Check size={18} /> Welcome to the BMP Circle. New drops will find you first.</p>
  }

  return (
    <form className={`nl ${compact ? 'nl--compact' : ''}`} onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor="nl-email">Email address</label>
      <input id="nl-email" className="input" type="email" inputMode="email" autoComplete="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(error)} aria-describedby="nl-msg" />
      <button className="btn" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Joining…' : 'Join the Circle'} <ArrowRight className="arrow" size={15} />
      </button>
      <p id="nl-msg" className={error || state === 'error' ? 'form-error' : 'form-note'}>
        {error || (state === 'error' ? 'Something went wrong. Please try again.' : 'New drops, fresh edits and BMP favourites. No spam, ever.')}
      </p>
    </form>
  )
}
