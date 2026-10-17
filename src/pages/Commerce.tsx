import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, LockKeyhole, Minus, Plus, Printer, ShoppingBag, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate, formatNaira, getEvent, type CartItem, type DemoBooking, type EventItem, type Ticket } from '../data'
import { EmptyState } from '../components'
import { useApp } from '../store'

function itemDetails(item: CartItem) {
  const event = getEvent(item.eventId)
  const ticket = event?.tickets.find((row) => row.id === item.ticketId)
  return event && ticket ? { event, ticket, subtotal: ticket.price * item.quantity } : null
}

export function CartPage() {
  const { cart, updateCart, removeCartItem } = useApp()
  const items = cart.map(itemDetails).filter((item): item is NonNullable<typeof item> => Boolean(item))
  const total = items.reduce((sum, item) => sum + item.subtotal, 0)
  return <main className="page-shell commerce-page"><Link className="back-link" to="/discover"><ArrowLeft size={16} /> Keep exploring</Link><div className="commerce-heading"><div><div className="eyebrow">YOUR PLANS, GATHERED</div><h1>Your booking <em>cart.</em></h1><p>Everything you need for a day worth remembering.</p></div><span className="commerce-count">{cart.reduce((sum, item) => sum + item.quantity, 0)} tickets</span></div>
    {!items.length ? <EmptyState title="Your cart is taking a breather" description="Find an event that feels right and your tickets will show up here." actionLabel="Explore events" /> :
      <div className="cart-layout"><div className="cart-items">{items.map(({ event, ticket, subtotal }) => <article className="cart-item" key={`${event.id}-${ticket.id}`}><Link className="cart-item-image" to={`/event/${event.id}`}><img src={event.image} alt="" /></Link><div className="cart-item-main"><Link className="cart-event-title" to={`/event/${event.id}`}>{event.title}</Link><span className="cart-meta">{formatDate(event.date)} · {event.city}</span><span className="cart-ticket-type">{ticket.name} · {formatNaira(ticket.price)} each</span><div className="cart-item-controls"><div className="quantity-control"><button type="button" onClick={() => updateCart(event.id, ticket.id, itemQuantity(cart, event.id, ticket.id) - 1)} aria-label="Decrease ticket quantity"><Minus size={13} /></button><span>{itemQuantity(cart, event.id, ticket.id)}</span><button type="button" onClick={() => updateCart(event.id, ticket.id, Math.min(ticket.limit, itemQuantity(cart, event.id, ticket.id) + 1))} disabled={itemQuantity(cart, event.id, ticket.id) >= ticket.limit} aria-label="Increase ticket quantity"><Plus size={13} /></button></div><button className="remove-item" type="button" onClick={() => removeCartItem(event.id, ticket.id)}><Trash2 size={14} /> Remove</button></div></div><strong className="cart-line-total">{formatNaira(subtotal)}</strong></article>)}
      <div className="cart-continue"><ShoppingBag size={16} /><Link to="/discover">Find another good plan</Link></div></div>
      <aside className="booking-summary"><div className="eyebrow">THE NUMBERS</div><h2>Booking summary</h2><div className="summary-rows">{items.map(({ event, ticket, subtotal }) => <div key={`${event.id}-${ticket.id}`}><span>{ticket.name} × {itemQuantity(cart, event.id, ticket.id)}<small>{event.title}</small></span><strong>{formatNaira(subtotal)}</strong></div>)}</div><div className="summary-total"><span>Total</span><strong>{formatNaira(total)}</strong></div><p className="summary-honesty">No extra fees have been added. These prices are demonstration data.</p><Link className="button button-primary summary-cta" to="/checkout">Continue to checkout <ArrowRight size={17} /></Link><div className="safe-demo"><LockKeyhole size={14} /> Demo checkout · no payment details needed</div></aside></div>}
  </main>
}
function itemQuantity(cart: CartItem[], eventId: string, ticketId: string) { return cart.find((item) => item.eventId === eventId && item.ticketId === ticketId)?.quantity || 0 }

export function CheckoutPage() {
  const { cart, setBooking, clearCart } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [processing, setProcessing] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const items = cart.map(itemDetails).filter((item): item is NonNullable<typeof item> => Boolean(item))
  const total = items.reduce((sum, item) => sum + item.subtotal, 0)
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (form.name.trim().length < 2) nextErrors.name = 'Please enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (form.phone.replace(/\D/g, '').length < 10) nextErrors.phone = 'Enter a valid phone number.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setConfirmed(true)
  }
  const finish = () => {
    setProcessing(true)
    window.setTimeout(() => {
      const booking: DemoBooking = { reference: `EVT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), items: cart, createdAt: new Date().toISOString() }
      setBooking(booking); clearCart(); navigate('/confirmation'); setProcessing(false)
    }, 650)
  }
  if (!items.length) return <main className="page-shell commerce-page"><EmptyState title="Nothing to check out just yet" description="Choose an experience and add tickets to your cart first." actionLabel="Find an event" /></main>
  return <main className="page-shell checkout-page"><Link className="back-link" to="/cart"><ArrowLeft size={16} /> Back to your cart</Link><div className="commerce-heading"><div><div className="eyebrow">A FEW DETAILS, THEN YOU’RE SET</div><h1>Demo <em>checkout.</em></h1><p>Just the essentials. Payment is not connected.</p></div><span className="checkout-step"><span>01</span> YOUR DETAILS <i /> <span className={confirmed ? 'step-done' : ''}>02</span> REVIEW</span></div>
    <div className="checkout-layout"><form className="checkout-form" onSubmit={submit} noValidate><div className="form-section-heading"><span>01</span><div><h2>Who’s coming?</h2><p>We’ll attach these details to your demo ticket.</p></div></div>
      <label className="form-field">Full name<input type="text" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} placeholder="e.g. Amara Okafor" />{errors.name && <small id="name-error" className="field-error">{errors.name}</small>}</label>
      <div className="form-row"><label className="form-field">Email address<input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} placeholder="you@example.com" />{errors.email && <small id="email-error" className="field-error">{errors.email}</small>}</label><label className="form-field">Phone number<input type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} placeholder="+234 800 000 0000" />{errors.phone && <small id="phone-error" className="field-error">{errors.phone}</small>}</label></div>
      <div className="demo-payment-notice"><span className="notice-icon"><Check size={17} /></span><div><strong>This is a demo checkout</strong><p>No real payment is taken. Never enter card or banking details here.</p></div></div>
      {!confirmed ? <button className="button button-primary checkout-submit" type="submit">Review your booking <ArrowRight size={17} /></button> :
        <div className="review-confirm"><div className="review-confirm-heading"><Check size={18} /><div><strong>Details look good</strong><span>Review the total, then create your sample booking.</span></div></div><button className="button button-primary checkout-submit" type="button" onClick={finish} disabled={processing}>{processing ? 'Creating demo booking…' : <>Confirm demo booking · {formatNaira(total)} <ArrowRight size={17} /></>}</button></div>}
    </form>
    <aside className="checkout-summary"><div className="eyebrow">YOUR EXPERIENCE</div><h2>Booking summary</h2>{items.map(({ event, ticket, subtotal }) => <div className="checkout-event" key={`${event.id}-${ticket.id}`}><img src={event.image} alt="" /><div><strong>{event.title}</strong><span>{formatDate(event.date)} · {event.city}</span><span>{ticket.name} × {itemQuantity(cart, event.id, ticket.id)}</span></div><b>{formatNaira(subtotal)}</b></div>)}<div className="summary-total"><span>Total due</span><strong>{formatNaira(total)}</strong></div><span className="checkout-no-fee">No service fees in this demo.</span></aside></div>
  </main>
}

export function ConfirmationPage() {
  const { booking } = useApp()
  if (!booking) return <main className="page-shell commerce-page"><EmptyState title="No booking to show" description="Your demo confirmation will appear here after you complete checkout." actionLabel="Discover events" /></main>
  const items = booking.items.map(itemDetails).filter((item): item is NonNullable<typeof item> => Boolean(item))
  const total = items.reduce((sum, item) => sum + item.subtotal, 0)
  return <main className="confirmation-page page-shell"><div className="confirmation-icon"><Check size={30} /></div><div className="eyebrow">A GOOD PLAN IS OFFICIALLY A PLAN</div><h1>You’re <em>all set, {booking.name.split(' ')[0]}.</em></h1><p className="confirmation-lede">Your sample booking is ready. We can’t wait for you to make a day of it.</p><div className="confirmation-ticket"><div className="confirmation-event-list">{items.map(({ event, ticket, subtotal }) => <div className="confirmation-event" key={`${event.id}-${ticket.id}`}><img src={event.image} alt="" /><div><span className="eyebrow">{ticket.name} · {itemQuantity(booking.items, event.id, ticket.id)} {itemQuantity(booking.items, event.id, ticket.id) === 1 ? 'TICKET' : 'TICKETS'}</span><h2>{event.title}</h2><p>{formatDate(event.date, { weekday: 'long', day: 'numeric', month: 'long' })} · {event.startTime}</p><p>{event.venue}, {event.city}</p></div><strong>{formatNaira(subtotal)}</strong></div>)}</div><div className="confirmation-meta"><span>BOOKING REFERENCE<strong>{booking.reference}</strong></span><span>BOOKED BY<strong>{booking.name}</strong></span><span>EMAIL<strong>{booking.email}</strong></span><span>TOTAL<strong>{formatNaira(total)}</strong></span></div><div className="demo-ticket-label"><span className="demo-note-dot" /> SAMPLE BOOKING · NOT A REAL TICKET</div></div><div className="confirmation-actions"><Link className="button button-primary" to="/ticket">View sample ticket <ArrowRight size={16} /></Link><Link className="button button-outline" to="/discover">Find another plan</Link></div></main>
}

export function DemoTicketPage() {
  const { booking } = useApp()
  const ticketEntries = booking?.items.map((item) => {
    const event = getEvent(item.eventId)
    const ticket = event?.tickets.find((row) => row.id === item.ticketId)
    return event && ticket ? { event, ticket, item } : null
  }).filter((entry): entry is { event: EventItem; ticket: Ticket; item: CartItem } => entry !== null)
  if (!booking || !ticketEntries?.length) return <main className="page-shell commerce-page"><EmptyState title="No sample ticket yet" description="Complete a demo booking to see your sample ticket." actionLabel="Explore events" /></main>
  return <main className="ticket-page page-shell"><div className="ticket-page-top"><div><div className="eyebrow">KEEP THIS ONE FOR THE MEMORY</div><h1>Your sample <em>ticket.</em></h1><p>This front-end demo ticket is not valid for entry.</p></div><button className="button button-outline print-button" type="button" onClick={() => window.print()}><Printer size={16} /> Print tickets</button></div>
    <div className="sample-ticket-list">{ticketEntries.map(({ event, ticket, item }) => <article className="sample-ticket" key={`${event.id}-${ticket.id}`}><div className="sample-ticket-visual"><img src={event.image} alt="" /><div className="sample-ticket-image-shade" /><span className="sample-ticket-brand">eventra<span>.</span></span><span className="sample-ticket-demo">DEMO TICKET</span><h2>{event.title}</h2></div><div className="sample-ticket-body"><div className="ticket-info-grid"><span>WHEN<strong>{formatDate(event.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · {event.startTime}</strong></span><span>WHERE<strong>{event.venue}, {event.city}</strong></span><span>ATTENDEE<strong>{booking.name}</strong></span><span>TICKET<strong>{ticket.name} · ×{item.quantity}</strong></span><span>REFERENCE<strong>{booking.reference}</strong></span><span>EMAIL<strong>{booking.email}</strong></span></div><div className="sample-code"><span className="code-squares" aria-hidden="true">▦</span><div><strong>SAMPLE ONLY</strong><small>This visual is not scannable<br />and cannot be used for entry.</small></div></div></div><div className="ticket-bottom-label">NOT VALID FOR ADMISSION · DEMO BOOKING</div></article>)}</div><Link className="text-link ticket-back-link" to="/confirmation"><ArrowLeft size={16} /> Back to confirmation</Link></main>
}
