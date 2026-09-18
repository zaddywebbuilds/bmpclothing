import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { useStore } from './lib/store'
import { prefersReducedMotion } from './lib/util'
import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import SearchOverlay from './components/SearchOverlay'
import QuickView from './components/QuickView'
import MobileMenu from './components/MobileMenu'
import OrderToast from './components/OrderToast'
import Cursor from './components/Cursor'
import Home from './pages/Home'

const Shop = lazy(() => import('./pages/Shop'))
const Product = lazy(() => import('./pages/Product'))
const Lookbook = lazy(() => import('./pages/Lookbook'))
const BmpWoman = lazy(() => import('./pages/BmpWoman'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Faq = lazy(() => import('./pages/Faq'))
const Policy = lazy(() => import('./pages/Policy'))
const Bag = lazy(() => import('./pages/Bag'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const NotFound = lazy(() => import('./pages/NotFound'))

let lenis = null
export const scrollToTop = () => (lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0))

export default function App() {
  const { pathname } = useLocation()
  const { panel, quickView } = useStore()
  const locked = Boolean(panel || quickView)

  useEffect(() => {
    if (prefersReducedMotion()) return
    lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true })
    let id
    const raf = (time) => { lenis.raf(time); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(id); lenis.destroy(); lenis = null }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('no-scroll', locked)
    if (lenis) locked ? lenis.stop() : lenis.start()
  }, [locked])

  useEffect(() => { scrollToTop() }, [pathname])

  return (
    <>
      <div className="canvas" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <a href="#main" className="skip-link">Skip to content</a>
      <AnnouncementBar />
      <Navbar />
      <main id="main" key={pathname} className="page-enter">
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/new-in" element={<Shop mode="new" />} />
            <Route path="/collections/:category" element={<Shop mode="category" />} />
            <Route path="/occasion/:occasion" element={<Shop mode="occasion" />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/lookbook" element={<Lookbook />} />
            <Route path="/the-bmp-woman" element={<BmpWoman />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/shipping" element={<Policy kind="shipping" />} />
            <Route path="/returns" element={<Policy kind="returns" />} />
            <Route path="/bag" element={<Bag />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />
      <QuickView />
      <OrderToast />
      <Cursor />
    </>
  )
}
