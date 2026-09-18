import { media } from '../data/catalog'
import { asset } from '../lib/util'

// Responsive WebP image from the generated media set. `id` is the manifest key, e.g. 'products/tops/bmp-t-8-main'.
export default function Img({ id, alt, sizes = '100vw', priority = false, position, className, style, ...rest }) {
  const m = media[id]
  if (!m) return null
  const srcSet = m.widths.map((w) => `${asset(`assets/bmp/${id}-${w}.webp`)} ${w}w`).join(', ')
  const fallback = asset(`assets/bmp/${id}-${m.widths[Math.min(1, m.widths.length - 1)]}.webp`)
  return (
    <img
      src={fallback}
      srcSet={srcSet}
      sizes={sizes}
      width={m.w}
      height={m.h}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding={priority ? 'sync' : 'async'}
      className={className}
      style={{ objectPosition: position || m.pos || '50% 30%', ...style }}
      {...rest}
    />
  )
}
