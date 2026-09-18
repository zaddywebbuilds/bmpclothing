import { useEffect, useRef, useState } from 'react'
import Img from './Img'
import { altText } from '../data/catalog'

export default function Gallery({ product: p, focus }) {
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState(null)
  const track = useRef(null)
  const images = p.images

  useEffect(() => { setIndex(0) }, [p.slug])
  useEffect(() => {
    if (!focus) return
    const i = images.indexOf(focus)
    if (i >= 0) go(i)
  }, [focus]) // eslint-disable-line react-hooks/exhaustive-deps

  const go = (i) => {
    setIndex(i)
    const el = track.current
    if (el && el.scrollWidth > el.clientWidth) el.scrollTo({ left: el.clientWidth * i, behavior: 'smooth' })
  }

  const onScroll = () => {
    const el = track.current
    if (!el || el.scrollWidth <= el.clientWidth) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    if (i !== index) setIndex(i)
  }

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  return (
    <div className={`gallery ${images.length > 1 ? 'has-thumbs' : ''}`}>
      {images.length > 1 && (
        <div className="gallery-thumbs" role="tablist" aria-label="Product images">
          {images.map((id, i) => (
            <button key={id} role="tab" aria-selected={i === index} aria-label={`View image ${i + 1}`} className={`panel gallery-thumb ${i === index ? 'is-on' : ''}`} onClick={() => go(i)}>
              <Img id={id} alt="" sizes="90px" />
            </button>
          ))}
        </div>
      )}

      <div className="gallery-main">
        <div ref={track} className="gallery-track" onScroll={onScroll}>
          {images.map((id, i) => (
            <div
              key={id}
              className={`panel gallery-slide ${i === index ? 'is-on' : ''} ${zoom && i === index ? 'is-zoom' : ''}`}
              onMouseMove={onMove}
              onMouseLeave={() => setZoom(null)}
              data-cursor="Zoom"
            >
              <Img
                id={id}
                alt={altText(p, i)}
                priority={i === 0}
                sizes="(max-width: 900px) 100vw, 50vw"
                style={zoom && i === index ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="gallery-dots" aria-hidden="true">
            {images.map((id, i) => <span key={id} className={i === index ? 'is-on' : ''} />)}
          </div>
        )}
        {p.worn && <span className="tag gallery-credit">Photo by a BMP customer</span>}
      </div>
    </div>
  )
}
