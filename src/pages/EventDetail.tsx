import { useState } from 'react'
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, MapPin, Share2, Ticket, Users } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { formatDate, formatNaira, getEvent } from '../data'
import { EmptyState } from '../components'
import { useApp } from '../store'

export default function EventDetail() {
  const { id = '' } = useParams()
  const event = getEvent(id)
  const { saved, cart, toggleSaved, addToCart, notify } = useApp()
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const navigate = useNavigate()
  if (!event) return <main className="page-shell"><EmptyState title="We can’t find that event" description="It may have moved or the link may be out of date." actionLabel="Explore events" /></main>
  const total = event.tickets.reduce((sum, ticket) => sum + ticket.price * (quantities[ticket.id] || 0), 0)
  const selectedCount = Object.values(quantities).reduce((sum, count) => sum + count, 0)
  const increment = (ticketId: string, delta: number, limit: number) => setQuantities((current) => { const next = Math.max(0, Math.min(limit, (current[ticketId] || 0) + delta)); return { ...current, [ticketId]: next } })
  const book = () => {
    if (!selectedCount) { notify('Choose at least one ticket to continue'); return }
    addToCart(event.tickets.filter((ticket) => quantities[ticket.id] > 0).map((ticket) => ({ eventId: event.id, ticketId: ticket.id, quantity: quantities[ticket.id] })))
    navigate('/cart')
  }
  const share = async () => { try { if (navigator.share) await navigator.share({ title: event.title, url: window.location.href }); else { await navigator.clipboard.writeText(window.location.href); notify('Event link copied') } } catch { notify('Sharing was cancelled') } }
  return <main className="event-detail-page page-shell">
    <Link className="back-link" to="/discover"><ArrowLeft size={16} /> Back to events</Link>
    <div className="event-hero-image"><img src={event.image} alt={`${event.title} event cover`} /><span className="event-hero-category">{event.category}</span><button className="event-share" type="button" onClick={share}><Share2 size={16} /> Share</button></div>
    <div className="detail-layout"><div className="event-story">
      <div className="event-detail-kicker"><span className="status-dot" /> A GOOD THING IS HAPPENING</div><div className="detail-title-line"><div><h1>{event.title}</h1><p className="detail-organizer">Put together by <strong>{event.organizer}</strong></p></div><button type="button" onClick={() => toggleSaved(event.id)} className={`detail-save ${saved.includes(event.id) ? 'is-saved' : ''}`} aria-label={saved.includes(event.id) ? 'Remove from saved events' : 'Save event'}><span>{saved.includes(event.id) ? <Check size={18} /> : <span className="heart-glyph">♡</span>}</span>{saved.includes(event.id) ? 'Saved' : 'Save'}</button></div>
      <div className="event-facts"><div><CalendarDays size={19} /><span><small>WHEN</small><strong>{formatDate(event.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong><span>{event.startTime}</span></span></div><div><MapPin size={19} /><span><small>WHERE</small><strong>{event.venue}</strong><span>{event.city}, {event.state === 'Federal Capital Territory' ? 'Abuja' : event.state}</span></span></div></div>
      <section className="detail-section"><div className="eyebrow">THE FEELING</div><h2>A little about the day</h2><p>{event.description}</p></section>
      <section className="detail-section schedule-section"><div className="eyebrow">HOW IT UNFOLDS</div><h2>On the day</h2><div className="schedule-list">{event.schedule.map((item) => <div key={item.time}><time>{item.time}</time><span className="schedule-dot" /><strong>{item.title}</strong></div>)}</div></section>
      <section className="detail-section"><div className="eyebrow">BEFORE YOU GO</div><h2>A few useful notes</h2><p>{event.attendeeInfo}</p><div className="demo-inventory-note"><span className="demo-note-dot" /> Ticket availability and prices shown are sample demo data.</div></section>
    </div>
    <aside className="ticket-panel"><div className="ticket-panel-top"><div><span className="eyebrow">COME BE PART OF IT</span><h2>Choose your tickets</h2></div><Ticket size={21} /></div><p className="ticket-panel-note">Select a ticket type to get started.</p>
      <div className="ticket-options">{event.tickets.map((ticket) => {
        const inCart = cart.find((item) => item.eventId === event.id && item.ticketId === ticket.id)?.quantity || 0
        const remaining = Math.max(0, ticket.limit - inCart)
        return <div key={ticket.id} className={`ticket-option ${(quantities[ticket.id] || 0) > 0 ? 'ticket-selected' : ''}`}><div className="ticket-option-heading"><div><strong>{ticket.name}</strong><span>{ticket.description}</span></div><strong className="ticket-price">{formatNaira(ticket.price)}</strong></div>{ticket.soldOut ? <div className="sold-out">Sold out</div> : <div className="ticket-quantity-row"><span>{remaining ? `${remaining} remaining · max ${ticket.limit} per booking` : 'Limit reached in your cart'}</span><div className="quantity-control"><button type="button" onClick={() => increment(ticket.id, -1, remaining)} aria-label={`Remove one ${ticket.name} ticket`} disabled={!quantities[ticket.id]}>−</button><span>{quantities[ticket.id] || 0}</span><button type="button" onClick={() => increment(ticket.id, 1, remaining)} aria-label={`Add one ${ticket.name} ticket`} disabled={(quantities[ticket.id] || 0) >= remaining}>+</button></div></div>}</div>
      })}</div>
      <div className="ticket-total"><span>{selectedCount} {selectedCount === 1 ? 'ticket' : 'tickets'} selected</span><strong>{formatNaira(total)}</strong></div><button className="button button-primary ticket-cta" type="button" onClick={book}>Add to booking <ArrowRight size={17} /></button><div className="safe-demo"><Clock3 size={14} /> Demo inventory · no payment taken</div>
    </aside></div>
    <div className="detail-mobile-booking"><div><span>{selectedCount} selected</span><strong>{formatNaira(total)}</strong></div><button className="button button-primary" type="button" onClick={book}>Add tickets <ArrowRight size={16} /></button></div>
    <div className="detail-bottom-strip"><Users size={17} /><span>Experiences are better shared.</span><Link to="/discover">Find another plan <ArrowRight size={15} /></Link></div>
  </main>
}
