import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import SocialIcon from './SocialIcon'
import Reveal, { Lines } from './Reveal'
import { site } from '../data/site'
import './instagram.css'

const SCRIPT = 'https://w.behold.so/widget.js'

// The widget script is only fetched when a feed id is set, so the default build makes
// no third-party request at all.
function Widget({ id }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (document.querySelector(`script[src="${SCRIPT}"]`)) return
    const s = document.createElement('script')
    s.src = SCRIPT
    s.type = 'module'
    s.async = true
    s.onerror = () => setFailed(true)
    document.head.appendChild(s)
  }, [])

  if (failed) return <FollowCard />
  return <behold-widget feed-id={id} />
}

function FollowCard() {
  return (
    <a className="ig-follow glass" href={site.instagram} target="_blank" rel="noopener noreferrer">
      <SocialIcon name="Instagram" size={26} />
      <strong className="display">{site.handle}</strong>
      <span className="ig-follow-note">New pieces, styling and customers wearing BMP, posted as they land.</span>
      <span className="link-line">Follow on Instagram <ArrowRight className="arrow" size={13} /></span>
    </a>
  )
}

export default function InstagramFeed() {
  if (!site.instagram) return null
  return (
    <Reveal className="section section--tight wrap ig-section" aria-labelledby="ig-title">
      <div className="section-head">
        <h2 id="ig-title" className="display caps h-md"><Lines lines={['As worn', <em key="l">in Lagos</em>]} /></h2>
        <a className="link-line reveal" href={site.instagram} target="_blank" rel="noopener noreferrer">
          {site.handle} <ArrowRight className="arrow" size={14} />
        </a>
      </div>
      {site.instagramFeed ? <Widget id={site.instagramFeed} /> : <FollowCard />}
    </Reveal>
  )
}
