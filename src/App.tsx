import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { X } from 'lucide-react'
import { EmptyState, EventGrid, Footer, Header } from './components'
import { events } from './data'
import { useApp } from './store'
import Home from './pages/Home'
import { Discover, NextPage } from './pages/Discover'
import EventDetail from './pages/EventDetail'
import { CartPage, CheckoutPage, ConfirmationPage, DemoTicketPage } from './pages/Commerce'
import { AboutPage, AccountPage, HelpPage } from './pages/Content'

function NotFound() {
  return <main className="page-shell not-found"><span className="eyebrow">A LITTLE DETOUR</span><h1>That page took<br /><em>a day off.</em></h1><p>Let’s get you back to something good.</p><Link to="/discover" className="button button-primary">Explore events</Link></main>
}

export default function App() {
  const { toast, notify } = useApp()
  const location = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') notify('') }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [notify])
  return <><Header /><Routes><Route path="/" element={<Home />} /><Route path="/discover" element={<Discover />} /><Route path="/next" element={<NextPage />} /><Route path="/event/:id" element={<EventDetail />} /><Route path="/saved" element={<SavedPage />} /><Route path="/cart" element={<CartPage />} /><Route path="/checkout" element={<CheckoutPage />} /><Route path="/confirmation" element={<ConfirmationPage />} /><Route path="/ticket" element={<DemoTicketPage />} /><Route path="/about" element={<AboutPage />} /><Route path="/help" element={<HelpPage />} /><Route path="/account" element={<AccountPage />} /><Route path="*" element={<NotFound />} /></Routes><Footer />{toast && <div className="toast-message" role="status">{toast}<button aria-label="Dismiss notification" onClick={() => notify('')}><X size={15} /></button></div>}</>
}

function SavedPage() {
  const { saved } = useApp()
  const savedEvents = events.filter((event) => saved.includes(event.id))
  return <main className="page-shell saved-page"><div className="page-intro saved-intro"><div className="eyebrow">THE ONES YOU WANT TO COME BACK TO</div><h1>Saved for <em>later.</em></h1><p>Your little collection of good plans, all in one place.</p></div>{savedEvents.length ? <EventGrid items={savedEvents} /> : <EmptyState title="Nothing saved just yet" description="When something catches your eye, tap the heart and we’ll keep it here for you." actionLabel="Find something good" />}</main>
}
