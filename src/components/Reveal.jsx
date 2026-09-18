import { useReveal } from '../lib/util'

// Section/div that reveals its .reveal / .reveal-img / .mask-line children on scroll.
export default function Reveal({ as: Tag = 'section', children, ...rest }) {
  const ref = useReveal()
  return <Tag ref={ref} {...rest}>{children}</Tag>
}

export const Lines = ({ lines, className = '' }) =>
  lines.map((l, i) => (
    <span key={i} className={`mask-line ${className}`}>
      <span style={{ transitionDelay: `${i * 90}ms` }}>{l}</span>
    </span>
  ))
