export default function Logo({ className = '', light = false }) {
  return (
    <span className={`logo ${light ? 'logo--light' : ''} ${className}`} aria-label="BMP Clothings">
      <span className="logo-mark" aria-hidden="true">BMP</span>
      <span className="logo-sub" aria-hidden="true">Clothings</span>
    </span>
  )
}
