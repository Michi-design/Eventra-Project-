import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ArrowRight, CalendarDays, Check, ChevronDown, Heart, MapPin, Menu, Search, ShoppingBag, X } from 'lucide-react'
import { categories, formatDate, formatNaira, states, type EventItem } from './data'
import { useApp } from './store'

export function Brand({ light = false }: { light?: boolean }) {
  return <Link className={`brand ${light ? 'brand-light' : ''}`} to="/" aria-label="Eventra home"><span className="brand-mark">e</span><span>eventra<span className="brand-dot">.</span></span></Link>
}

export function LocationPicker({ compact = false }: { compact?: boolean }) {
  const { location, setLocation } = useApp()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => { document.removeEventListener('pointerdown', onPointerDown); window.removeEventListener('keydown', onKeyDown) }
  }, [])
  const options = useMemo(() => ['All locations', ...states].filter((state) => {
    const searchable = state === 'Federal Capital Territory' ? `${state} Abuja FCT` : state
    return searchable.toLowerCase().includes(query.toLowerCase())
  }), [query])
  return <div className={`location-picker ${compact ? 'location-compact' : ''}`} ref={rootRef}>
    <button className="location-trigger" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open}><MapPin size={17} /><span>{location === 'All locations' ? 'Everywhere' : location === 'Federal Capital Territory' ? 'Abuja' : location}</span><ChevronDown size={14} /></button>
    {open && <div className="location-popover">
      <label className="location-search"><Search size={16} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search 36 states & Abuja" /></label>
      <div className="location-options">{options.map((state) => <button type="button" key={state} onClick={() => { setLocation(state); setOpen(false); setQuery('') }} className={location === state ? 'selected' : ''}>{state === 'Federal Capital Territory' ? 'Federal Capital Territory (Abuja)' : state}{location === state && <Check size={15} />}</button>)}</div>
    </div>}
  </div>
}

export function Header() {
  const { saved, cart } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') { setCategoriesOpen(false); setMobileOpen(false) } }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
  const navItems = <><NavLink to="/discover" onClick={() => setMobileOpen(false)}>Discover</NavLink><NavLink to="/next" onClick={() => setMobileOpen(false)}>Next</NavLink><div className="nav-categories"><button type="button" className={`nav-category-button ${categoriesOpen ? 'active' : ''}`} onClick={() => setCategoriesOpen((open) => !open)}>Categories <ChevronDown size={13} /></button>{categoriesOpen && <div className="category-popover">{categories.map((category) => <Link key={category} to={`/discover?category=${encodeURIComponent(category)}`} onClick={() => { setCategoriesOpen(false); setMobileOpen(false) }}>{category}<ArrowRight size={14} /></Link>)}</div>}</div><NavLink to="/about" onClick={() => setMobileOpen(false)}>About</NavLink></>
  return <header className="site-header">
    <div className="header-inner"><Brand />
      <nav className="desktop-nav" aria-label="Main navigation">{navItems}</nav>
      <div className="header-actions"><LocationPicker compact />
        <Link className="icon-link saved-link" to="/saved" aria-label={`Saved events, ${saved.length} saved`}><Heart size={19} /><span className="nav-count">{saved.length}</span></Link>
        <Link className="icon-link cart-link" to="/cart" aria-label={`Cart, ${cart.reduce((total, item) => total + item.quantity, 0)} tickets`}><ShoppingBag size={19} /><span className="nav-count">{cart.reduce((total, item) => total + item.quantity, 0)}</span></Link>
        <Link className="sign-in-link" to="/account">Sign in</Link>
        <button className="mobile-menu-button" type="button" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>{mobileOpen ? <X /> : <Menu />}</button>
      </div>
    </div>
    {mobileOpen && <div className="mobile-panel"><nav aria-label="Mobile navigation">{navItems}<Link to="/saved" onClick={() => setMobileOpen(false)}>Saved events <span className="mobile-count">{saved.length}</span></Link><Link to="/cart" onClick={() => setMobileOpen(false)}>Your cart <span className="mobile-count">{cart.reduce((total, item) => total + item.quantity, 0)}</span></Link><Link to="/account" onClick={() => setMobileOpen(false)}>Sign in</Link></nav><LocationPicker /></div>}
  </header>
}

export function SearchBar({ initial = '', onSearch }: { initial?: string; onSearch?: (value: string) => void }) {
  const [query, setQuery] = useState(initial)
  const navigate = useNavigate()
  const submit = (event: FormEvent) => { event.preventDefault(); if (onSearch) onSearch(query); else navigate(`/discover?q=${encodeURIComponent(query)}`) }
  return <form className="search-bar" onSubmit={submit}><Search size={19} /><input aria-label="Search events" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events, artists, venues..." /><button type="submit">Search events <ArrowRight size={16} /></button></form>
}

export function EventCard({ event, variant = 'default' }: { event: EventItem; variant?: 'default' | 'featured' }) {
  const { saved, toggleSaved } = useApp()
  const isSaved = saved.includes(event.id)
  return <article className={`event-card ${variant === 'featured' ? 'event-card-featured' : ''}`}>
    <div className="event-image-wrap"><Link to={`/event/${event.id}`} aria-label={`View ${event.title}`}><img src={event.image} alt="" loading="lazy" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80' }} /></Link>
      <span className="event-tag">{event.category}</span><button className={`save-button ${isSaved ? 'is-saved' : ''}`} type="button" onClick={() => toggleSaved(event.id)} aria-label={isSaved ? `Remove ${event.title} from saved events` : `Save ${event.title}`} aria-pressed={isSaved}><Heart size={18} fill={isSaved ? 'currentColor' : 'none'} /></button>
    </div>
    <div className="event-card-body"><div className="event-card-date"><CalendarDays size={14} /> {formatDate(event.date)} <span>·</span> {event.startTime}</div>
      <Link className="event-card-title" to={`/event/${event.id}`}>{event.title}</Link>
      <div className="event-card-location"><MapPin size={15} /> {event.venue}, {event.city}</div>
      <div className="event-card-bottom"><span>From <strong>{formatNaira(event.price)}</strong></span><Link to={`/event/${event.id}`} aria-label={`Tickets for ${event.title}`}><ArrowRight size={17} /></Link></div>
    </div>
  </article>
}

export function EventGrid({ items, featured = false }: { items: EventItem[]; featured?: boolean }) {
  if (!items.length) return <EmptyState title="No events found" description="Try a different search or clear your filters to see more experiences." actionLabel="Explore all events" actionTo="/discover" />
  return <div className={`event-grid ${featured ? 'event-grid-featured' : ''}`}>{items.map((event) => <EventCard key={event.id} event={event} variant={featured ? 'featured' : 'default'} />)}</div>
}

export function EmptyState({ title, description, actionLabel, actionTo = '/discover' }: { title: string; description: string; actionLabel?: string; actionTo?: string }) {
  return <div className="empty-state"><span className="empty-icon"><CalendarDays size={24} /></span><h2>{title}</h2><p>{description}</p>{actionLabel && <Link className="button button-primary" to={actionTo}>{actionLabel}<ArrowRight size={16} /></Link>}</div>
}

export function SectionHeading({ eyebrow, title, description, linkText, linkTo = '/discover' }: { eyebrow?: string; title: string; description?: string; linkText?: string; linkTo?: string }) {
  return <div className="section-heading">{<div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h2>{title}</h2>{description && <p>{description}</p>}</div>}{linkText && <Link className="text-link" to={linkTo}>{linkText}<ArrowRight size={16} /></Link>}</div>
}

export function Footer() {
  return <footer className="site-footer"><div className="footer-main"><div className="footer-brand-col"><Brand /><p>Good days start with great plans. Find experiences that bring people together, all across Nigeria.</p><span className="demo-note">A front-end portfolio demo</span></div>
    <div className="footer-col"><h3>Explore</h3><Link to="/discover">All events</Link><Link to="/next">Coming up next</Link><Link to="/saved">Saved events</Link></div>
    <div className="footer-col"><h3>Eventra</h3><Link to="/about">About us</Link><Link to="/help">Help & FAQs</Link><Link to="/account">Sign in</Link></div>
    <div className="footer-col"><h3>Good to know</h3><a href="/help#booking">Booking help</a><a href="/help#demo">Demo limitations</a><span>Privacy & terms · Demo</span></div>
  </div><div className="footer-bottom"><span>© 2026 Eventra. Made for moments that matter.</span><span>Designed with care in Nigeria <span className="footer-spark">✳</span></span></div></footer>
}

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const submit = (event: FormEvent) => { event.preventDefault(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setMessage('Enter a valid email address to continue.'); return } setMessage('You’re on the list — demo only, no email was sent.'); setEmail('') }
  return <form className="newsletter-form" onSubmit={submit}><div className="newsletter-input"><input aria-label="Email address for updates" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" /><button type="submit" aria-label="Subscribe to event updates"><ArrowRight size={18} /></button></div>{message && <span role="status">{message}</span>}</form>
}

export function goToEvent(event: EventItem) { return `/event/${event.id}` }
