import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Ruler } from 'lucide-react'
import WaIcon from './WaIcon'
import { SIZE_CHART, CM_PER_IN, PARTS, recommendSize, loadMySize, saveMySize } from '../data/sizes'
import { waLink } from '../data/site'
import './size.css'

const LABEL = { bust: 'Bust', waist: 'Waist', hip: 'Hip' }
const HINT = {
  bust: 'Around the fullest part of your bust',
  waist: 'Around your natural waist, the narrowest part',
  hip: 'Around the fullest part of your hips and bum',
}

export default function SizeFinder({ product, onUse, compact = false }) {
  const saved = loadMySize()
  const [unit, setUnit] = useState(saved?.unit || 'in')
  const [vals, setVals] = useState(() => {
    if (!saved?.inches) return { bust: '', waist: '', hip: '' }
    const f = saved.unit === 'cm' ? CM_PER_IN : 1
    return Object.fromEntries(PARTS.map((p) => [p, saved.inches[p] ? String(Math.round(saved.inches[p] * f * 10) / 10) : '']))
  })
  const [fit, setFit] = useState(saved?.fit || 'fitted')

  const inches = useMemo(() => {
    const f = unit === 'cm' ? 1 / CM_PER_IN : 1
    return Object.fromEntries(PARTS.map((p) => [p, parseFloat(vals[p]) > 0 ? parseFloat(vals[p]) * f : 0]))
  }, [vals, unit])
  const res = useMemo(() => recommendSize(inches, fit), [inches, fit])

  const switchUnit = (u) => {
    if (u === unit) return
    const f = u === 'cm' ? CM_PER_IN : 1 / CM_PER_IN
    setVals((v) => Object.fromEntries(PARTS.map((p) => [p, v[p] ? String(Math.round(parseFloat(v[p]) * f * 10) / 10) : ''])))
    setUnit(u)
  }

  const use = () => {
    saveMySize({ size: res.size, fit, unit, inches })
    onUse?.(String(res.size))
  }

  const helpText = `Hello BMP Clothings 👋\n\nPlease help me with my size${product ? ` for *${product.title}*` : ''}.\n📏 Bust: ${vals.bust || '?'} ${unit}\n📏 Waist: ${vals.waist || '?'} ${unit}\n📏 Hip: ${vals.hip || '?'} ${unit}`

  return (
    <div className={`sf ${compact ? 'sf--compact' : ''}`}>
      <div className="sf-head">
        <span className="sf-icon"><Ruler size={18} strokeWidth={1.6} /></span>
        <div>
          <h2 className="display h-sm">Find my size</h2>
          <p className="sf-sub">Enter your body measurements. Any one works, all three is best.</p>
        </div>
      </div>

      <div className="sf-unit" role="group" aria-label="Units">
        <button type="button" className="chip" aria-pressed={unit === 'in'} onClick={() => switchUnit('in')}>Inches</button>
        <button type="button" className="chip" aria-pressed={unit === 'cm'} onClick={() => switchUnit('cm')}>Centimetres</button>
      </div>

      <div className="sf-fields">
        {PARTS.map((p) => (
          <label key={p} className="field sf-field">
            <span>{LABEL[p]}</span>
            <div className="sf-input">
              <input
                className="input"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.5"
                placeholder={unit === 'in' ? 'e.g. 40' : 'e.g. 102'}
                value={vals[p]}
                onChange={(e) => setVals({ ...vals, [p]: e.target.value })}
              />
              <em>{unit}</em>
            </div>
            <small>{HINT[p]}</small>
          </label>
        ))}
      </div>

      <div className="sf-fit" role="group" aria-label="How do you like your clothes to fit?">
        <span className="eyebrow">How do you like it to fit?</span>
        <div>
          <button type="button" className="chip" aria-pressed={fit === 'fitted'} onClick={() => setFit('fitted')}>Snatched &amp; fitted</button>
          <button type="button" className="chip" aria-pressed={fit === 'relaxed'} onClick={() => setFit('relaxed')}>Comfortable &amp; relaxed</button>
        </div>
      </div>

      <div className="sf-result glass" aria-live="polite">
        {!res && <p className="sf-empty">Your BMP size will appear here.</p>}
        {res && res.custom && (
          <>
            <p className="sf-label">Let us fit you personally</p>
            <p className="sf-note">Your {res.above.map((p) => LABEL[p].toLowerCase()).join(' and ')} measurement is above our standard size 22. Send your measurements and we will guide you to the right piece.</p>
            <a className="btn btn--block" href={waLink(helpText)} target="_blank" rel="noopener noreferrer"><WaIcon /> Send my measurements</a>
          </>
        )}
        {res && !res.custom && (
          <>
            <p className="sf-label">Your BMP size</p>
            <p className="sf-size display">{res.size}</p>
            {res.spread >= 4 ? (
              <p className="sf-note">Your measurements sit across sizes ({Object.entries(res.per).map(([p, s]) => `${LABEL[p].toLowerCase()} ${s}`).join(', ')}). We chose {res.size} so it fits your {res.decidedBy.map((p) => LABEL[p].toLowerCase()).join(' and ')}. Many BMP pieces are stretch and ruched, so message us if you would like a second opinion.</p>
            ) : res.belowChart ? (
              <p className="sf-note">Size 8 is our smallest. It should fit, and we can advise on WhatsApp.</p>
            ) : (
              <p className="sf-note">{fit === 'relaxed' ? 'One size up for a comfortable, relaxed fit.' : 'A close, body-confident fit, just how BMP pieces are designed to sit.'}</p>
            )}
            <div className="sf-actions">
              <button type="button" className="btn btn--block" onClick={use}><Check size={16} /> {onUse ? `Use size ${res.size}` : `Save size ${res.size}`}</button>
              <a className="btn btn--glass btn--block" href={waLink(`${helpText}\n\nThe size finder suggested: *${res.size}*`)} target="_blank" rel="noopener noreferrer"><WaIcon /> Confirm with BMP</a>
            </div>
          </>
        )}
      </div>

      {!compact && <p className="form-note sf-foot">Not sure how to measure? Use a soft tape over light clothing, keep it level and snug, not tight. <Link to="/size-guide">See the full size chart</Link></p>}
      {compact && <Link className="link-line sf-chart" to="/size-guide">Full size chart</Link>}
    </div>
  )
}

export function SizeTable() {
  const [unit, setUnit] = useState('in')
  const f = unit === 'cm' ? CM_PER_IN : 1
  const fmt = (n) => (unit === 'cm' ? Math.round(n * f) : n)
  return (
    <div className="st">
      <div className="sf-unit" role="group" aria-label="Units">
        <button type="button" className="chip" aria-pressed={unit === 'in'} onClick={() => setUnit('in')}>Inches</button>
        <button type="button" className="chip" aria-pressed={unit === 'cm'} onClick={() => setUnit('cm')}>Centimetres</button>
      </div>
      <div className="st-wrap glass">
        <table>
          <caption className="sr-only">BMP Clothings size chart in {unit === 'in' ? 'inches' : 'centimetres'}</caption>
          <thead><tr><th scope="col">Size</th><th scope="col">Bust</th><th scope="col">Waist</th><th scope="col">Hip</th></tr></thead>
          <tbody>
            {SIZE_CHART.map((r) => (
              <tr key={r.size}><th scope="row">{r.size}</th><td>{fmt(r.bust)}</td><td>{fmt(r.waist)}</td><td>{fmt(r.hip)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
