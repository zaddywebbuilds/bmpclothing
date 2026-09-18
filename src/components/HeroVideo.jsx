import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import Img from './Img'
import { site } from '../data/site'
import { asset, prefersReducedMotion } from '../lib/util'

export default function HeroVideo() {
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [allowed] = useState(() => Boolean(site.heroVideo) && !prefersReducedMotion())

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const on = () => setPlaying(!v.paused)
    v.addEventListener('play', on)
    v.addEventListener('pause', on)
    v.play().catch(() => {})
    return () => { v.removeEventListener('play', on); v.removeEventListener('pause', on) }
  }, [])

  if (!allowed) return <Img id="video/bmp-hero-poster" alt="BMP Clothings pieces floating on glass panels" priority sizes="(max-width: 900px) 100vw, 60vw" />

  const base = asset(site.heroVideo)
  return (
    <>
      <video
        ref={ref}
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={asset('assets/bmp/video/bmp-hero-poster-752.webp')}
        aria-label="BMP Clothings pieces presented on floating glass panels"
      >
        <source src={`${base}.webm`} type="video/webm" />
        <source src={`${base}.mp4`} type="video/mp4" />
      </video>
      <button
        className="hero-video-toggle icon-btn icon-btn--glass"
        onClick={() => (ref.current.paused ? ref.current.play() : ref.current.pause())}
        aria-label={playing ? 'Pause video' : 'Play video'}
      >
        {playing ? <Pause size={14} /> : <Play size={14} />}
      </button>
    </>
  )
}
