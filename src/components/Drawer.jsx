import { useRef } from 'react'
import { X } from 'lucide-react'
import { useFocusTrap } from '../lib/util'
import './overlays.css'

// Shared shell for side drawers and centred dialogs.
export default function Drawer({ open, onClose, label, side = 'right', className = '', children, title }) {
  const ref = useRef(null)
  useFocusTrap(open, ref, onClose)
  return (
    <div className={`ov ov--${side} ${open ? 'is-open' : ''}`} aria-hidden={!open} inert={!open}>
      <div className="ov-scrim" onClick={onClose} />
      <div ref={ref} className={`ov-panel ${className}`} role="dialog" aria-modal="true" aria-label={label} data-lenis-prevent>
        {title !== undefined && (
          <div className="ov-head">
            <div>{title}</div>
            <button className="icon-btn icon-btn--glass" onClick={onClose} aria-label="Close">
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
