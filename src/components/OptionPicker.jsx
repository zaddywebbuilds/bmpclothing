import { useEffect, useMemo, useState } from 'react'
import { Ruler } from 'lucide-react'
import Drawer from './Drawer'
import SizeFinder from './SizeFinder'
import { CHART_SIZES, loadMySize, usesChart } from '../data/sizes'

// Colour/size selection. Sizes come from the product's own variants, or BMP's size chart otherwise.
export function useOptions(p) {
  const [colour, setColour] = useState(null)
  const [size, setSize] = useState(null)
  const [savedSize, setSavedSize] = useState(() => loadMySize()?.size)
  useEffect(() => { setColour(null); setSize(null) }, [p?.slug])
  useEffect(() => {
    const on = () => setSavedSize(loadMySize()?.size)
    window.addEventListener('bmp:size', on)
    return () => window.removeEventListener('bmp:size', on)
  }, [])

  return useMemo(() => {
    if (!p) return { ready: false }
    const variants = p.variants || []
    const colours = p.colours || []
    const chart = usesChart(p)
    const sizesFor = (c) => variants.filter((v) => !c || v.colour === c).map((v) => v.size).filter(Boolean)
    const sizes = chart ? CHART_SIZES : [...new Set(sizesFor(colour))]
    const needColour = colours.length > 1
    const needSize = sizes.length > 1
    const chosenColour = colour || (colours.length === 1 ? colours[0].name : null)
    const remembered = chart && savedSize && sizes.includes(String(savedSize)) ? String(savedSize) : null
    const chosenSize = size || remembered || (sizes.length === 1 ? sizes[0] : null)
    const image = colours.find((c) => c.name === chosenColour)?.image || null
    const sizeLabel = chosenSize ? (chart ? `Size ${chosenSize}` : chosenSize) : null
    const label = [chosenColour, sizeLabel].filter(Boolean).join(' / ') || null
    const ready = (!needColour || chosenColour) && (!needSize || chosenSize)
    return {
      colours, sizes, chart, colour: chosenColour, size: chosenSize, fromFinder: !size && !!remembered,
      setColour: (c) => { setColour(c); if (!chart) setSize(null) }, setSize, image, label, ready, needColour, needSize,
    }
  }, [p, colour, size, savedSize])
}

export default function OptionPicker({ product, opts, finder: allowFinder = true }) {
  const [finder, setFinder] = useState(false)
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
          <legend>
            Size
            {opts.size ? <span>: {opts.size}{opts.fromFinder ? ' (your saved size)' : ''}</span> : opts.needSize ? <span className="opt-hint"> · choose one</span> : null}
          </legend>
          <div className="opt-row">
            {opts.sizes.map((s) => (
              <button key={s} type="button" className={`chip opt-size ${opts.size === s ? 'is-active' : ''}`} aria-pressed={opts.size === s} onClick={() => opts.setSize(s)}>{s}</button>
            ))}
          </div>
          {opts.chart && allowFinder && (
            <button type="button" className="opt-finder" onClick={() => setFinder(true)}>
              <Ruler size={15} strokeWidth={1.6} /> Not sure? <u>Find my size</u>
            </button>
          )}
        </fieldset>
      )}
      {opts.chart && allowFinder && (
        <Drawer open={finder} onClose={() => setFinder(false)} label="Find my size" side="center" className="sf-drawer" title="">
          <div className="sf-drawer-body">
            <SizeFinder compact product={product} onUse={(s) => { opts.setSize(s); setFinder(false) }} />
          </div>
        </Drawer>
      )}
    </div>
  )
}
