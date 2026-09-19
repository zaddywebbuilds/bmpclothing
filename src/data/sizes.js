// BMP Clothings size guide (supplied by the owner, Sept 2026). Body measurements in inches.
export const SIZE_CHART = [
  { size: 8, bust: 37, waist: 28, hip: 38 },
  { size: 10, bust: 38, waist: 31, hip: 41 },
  { size: 12, bust: 39, waist: 33, hip: 43 },
  { size: 14, bust: 41, waist: 35, hip: 45 },
  { size: 16, bust: 44, waist: 37, hip: 47 },
  { size: 18, bust: 46, waist: 39, hip: 49 },
  { size: 20, bust: 48, waist: 41, hip: 51 },
  { size: 22, bust: 50, waist: 43, hip: 53 },
]

export const CHART_SIZES = SIZE_CHART.map((r) => String(r.size))
export const PARTS = ['bust', 'waist', 'hip']
export const CM_PER_IN = 2.54

// Half an inch of give: BMP pieces are largely stretch, ruched and draped.
const EASE = 0.5

// Smallest size whose chart value covers the measurement; null when above the chart.
const sizeFor = (part, inches) => {
  const row = SIZE_CHART.find((r) => r[part] >= inches - EASE)
  return row ? row.size : null
}

export function recommendSize({ bust, waist, hip }, fit = 'fitted') {
  const given = { bust, waist, hip }
  const per = {}
  PARTS.forEach((p) => {
    if (given[p] > 0) per[p] = sizeFor(p, given[p])
  })
  const parts = Object.keys(per)
  if (!parts.length) return null
  const above = parts.filter((p) => per[p] === null)
  const sizes = parts.map((p) => per[p]).filter((s) => s !== null)
  const max = SIZE_CHART[SIZE_CHART.length - 1].size
  if (above.length) return { size: null, per, above, custom: true }

  let size = Math.max(...sizes)
  if (fit === 'relaxed' && size < max) size += 2
  const spread = Math.max(...sizes) - Math.min(...sizes)
  const decidedBy = parts.filter((p) => per[p] === Math.max(...sizes))
  return { size, per, spread, decidedBy, custom: false, belowChart: sizes.every((s) => s === SIZE_CHART[0].size) && parts.some((p) => given[p] < SIZE_CHART[0][p] - 2) }
}

const KEY = 'bmp.size'
export const loadMySize = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || null } catch { return null }
}
export const saveMySize = (v) => {
  try { localStorage.setItem(KEY, JSON.stringify(v)) } catch { /* storage unavailable */ }
  window.dispatchEvent(new Event('bmp:size'))
}

// Clothing uses the chart; pieces with their own size variants (e.g. BMP T 14) keep those.
export const usesChart = (p) => !(p.variants || []).some((v) => v.size)
