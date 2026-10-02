export default function Logo({ className = '', light = false }) {
  return (
    <span className={`logo ${light ? 'logo--light' : ''} ${className}`} aria-label="BMP Clothings">
      <img
        src="/assets/bmp/brand/logo.jpg"
        alt="BMP Clothings"
        className="logo-img"
        width="40"
        height="40"
      />
      <span className="logo-sub" aria-hidden="true">Clothings</span>
    </span>
  )
}
