import { Component } from 'react'
import { Link } from 'react-router-dom'
import WaIcon from './WaIcon'
import { waLink } from '../data/site'
import './error-boundary.css'

// A thrown render error unmounts the whole React tree, so without this the site goes
// blank. Most likely cause here is a lazy route chunk failing on a patchy connection.
export default class ErrorBoundary extends Component {
  state = { failed: false, chunk: false }

  static getDerivedStateFromError(err) {
    const msg = `${err?.name || ''} ${err?.message || ''}`
    return { failed: true, chunk: /chunk|dynamically imported|Importing a module/i.test(msg) }
  }

  componentDidCatch(err, info) {
    if (import.meta.env.DEV) console.error('Render error:', err, info)
  }

  render() {
    if (!this.state.failed) return this.props.children
    const { chunk } = this.state
    return (
      <section className="errb wrap">
        <p className="index-label">Something went wrong</p>
        <h1 className="display caps h-lg">
          {chunk ? 'This page did not finish loading.' : 'This page hit a snag.'}
        </h1>
        <p className="lede errb-note">
          {chunk
            ? 'That is usually a dropped connection rather than a problem with your order. Reload and it should come straight back.'
            : 'Your bag and saved pieces are safe on this device. Reload the page, or head back and try again.'}
        </p>
        <div className="errb-actions">
          <button className="btn" onClick={() => window.location.reload()}>Reload the page</button>
          <Link className="btn btn--glass" to="/">Back home</Link>
        </div>
        <a className="errb-wa" href={waLink('Hello BMP Collections 👋\n\nI had trouble loading a page on your website.')} target="_blank" rel="noopener noreferrer">
          <WaIcon size={15} /> Tell us what happened
        </a>
      </section>
    )
  }
}
