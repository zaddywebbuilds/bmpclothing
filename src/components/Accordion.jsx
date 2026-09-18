import { useId, useState } from 'react'
import { Plus } from 'lucide-react'

export function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <div className={`acc ${open ? 'is-open' : ''}`}>
      <h3>
        <button className="acc-btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
          <span>{title}</span>
          <Plus size={16} strokeWidth={1.5} className="acc-icon" />
        </button>
      </h3>
      <div id={id} className="acc-panel" role="region">
        <div><div className="acc-inner">{children}</div></div>
      </div>
    </div>
  )
}

export default function Accordion({ children }) {
  return <div className="accordion">{children}</div>
}
