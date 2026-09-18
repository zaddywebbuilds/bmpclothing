import { useEffect, useMemo, useState } from 'react'

// Colour/size selection driven only by options that exist in the product data.
export function useOptions(p) {
  const [colour, setColour] = useState(null)
  const [size, setSize] = useState(null)
  useEffect(() => { setColour(null); setSize(null) }, [p?.slug])

  return useMemo(() => {
    if (!p) return { ready: false }
    const variants = p.variants || []
    const colours = p.colours || []
    const sizesFor = (c) => variants.filter((v) => !c || v.colour === c).map((v) => v.size).filter(Boolean)
    const sizes = [...new Set(sizesFor(colour))]
    const needColour = colours.length > 1
    const needSize = sizes.length > 1
    const chosenColour = colour || (colours.length === 1 ? colours[0].name : null)
    const chosenSize = size || (sizes.length === 1 ? sizes[0] : null)
    const image = colours.find((c) => c.name === chosenColour)?.image || null
    const label = [chosenColour, chosenSize].filter(Boolean).join(' / ') || null
    const ready = (!needColour || chosenColour) && (!needSize || chosenSize)
    return { colours, sizes, colour: chosenColour, size: chosenSize, setColour: (c) => { setColour(c); setSize(null) }, setSize, image, label, ready, needColour, needSize }
  }, [p, colour, size])
}

export default function OptionPicker({ opts }) {
  if (!opts.colours) return null
  return (
    <div className="opts">
      {opts.colours.length > 0 && (
        <fieldset className="opt">
          <legend>Colour{opts.colour ? <span>: {opts.colour}</span> : opts.needColour ? <span className="opt-hint"> · choose one</span> : null}</legend>
          <div className="opt-row">
            {opts.colours.map((c) => (
              <button
                key={c.name}
                type="button"
                className={`swatch ${opts.colour === c.name ? 'is-on' : ''}`}
                aria-pressed={opts.colour === c.name}
                aria-label={c.name}
                title={c.name}
                onClick={() => opts.setColour(c.name)}
              >
                <i style={{ background: c.hex }} />
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {opts.sizes.length > 0 && (
        <fieldset className="opt">
          <legend>Size{opts.size ? <span>: {opts.size}</span> : null}</legend>
          <div className="opt-row">
            {opts.sizes.map((s) => (
              <button key={s} type="button" className={`chip ${opts.size === s ? 'is-active' : ''}`} aria-pressed={opts.size === s} onClick={() => opts.setSize(s)}>{s}</button>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  )
}
