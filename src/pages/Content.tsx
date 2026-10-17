import { useState, type FormEvent } from 'react'
import { ArrowRight, Check, CircleHelp, Heart, MapPin, Search, Ticket, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AboutPage() {
  return <main className="about-page"><section className="about-hero page-shell"><div><div className="eyebrow">A LITTLE MORE LIFE, PLEASE</div><h1>For all the moments<br />that make <em>us.</em></h1><p>Eventra makes it easier to find the experiences that turn an ordinary day into something you want to remember.</p><Link className="button button-primary" to="/discover">Find your next plan <ArrowRight size={16} /></Link></div><img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1300&q=85" alt="Friends gathering around a shared meal" /></section>
    <section className="about-values page-shell"><div className="eyebrow">WHY WE’RE HERE</div><h2>Good experiences bring<br />people a little closer.</h2><p className="about-large-copy">There’s a particular kind of magic in being there. The room before the music starts. The table full of new friends. The unexpected thing you’re still talking about on Monday. We’re here to help you find more of it.</p><div className="values-grid"><article><span>01</span><h3>Find your people</h3><p>Discover experiences shaped around what you love, with the people you love spending time with.</p></article><article><span>02</span><h3>Explore closer</h3><p>From familiar favourites to something new around the corner, good plans happen all over Nigeria.</p></article><article><span>03</span><h3>Make it easy</h3><p>Clear event details and a simple booking journey help you spend less time planning, more time there.</p></article></div></section>
    <section className="how-section"><div className="page-shell"><div className="eyebrow">HOW IT WORKS</div><h2>Three little steps<br />to a very good day.</h2><div className="how-grid"><article><Search /><span>01</span><h3>Find your thing</h3><p>Search by mood, category, date, or city to find an experience that feels right.</p></article><article><Heart /><span>02</span><h3>Make it yours</h3><p>Save the events you love and choose the ticket that fits your kind of outing.</p></article><article><Ticket /><span>03</span><h3>Get out there</h3><p>Complete the demo booking flow and get a sample ticket to see the whole journey.</p></article></div></div></section>
    <section className="about-cta page-shell"><span className="eyebrow">YOUR NEXT STORY IS OUT THERE</span><h2>So, what sounds <em>good?</em></h2><Link className="button button-primary" to="/discover">Explore events <ArrowRight size={16} /></Link></section>
  </main>
}

export function AccountPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const submit = (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setMessage('This is a front-end demo. No account was created and your password was not saved.')
    setPassword('')
  }
  return <main className="account-page page-shell"><div className="account-art"><img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1100&q=85" alt="Warm lights at an evening celebration" /><div><span className="eyebrow">GOOD THINGS ARE BETTER TOGETHER</span><h2>Keep your<br /><em>good plans</em><br />close.</h2></div></div><div className="account-panel"><div className="eyebrow">WELCOME TO EVENTRA</div><h1>Come on <em>in.</em></h1><p>Sign in to pick up where your next good day left off.</p><form onSubmit={submit} className="account-form"><label className="form-field">Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" /></label><label className="form-field">Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="current-password" /></label>{error && <p className="inline-error" role="alert">{error}</p>}{message && <p className="inline-success" role="status"><Check size={16} />{message}</p>}<button type="submit" className="button button-primary account-submit">Sign in <ArrowRight size={16} /></button></form><div className="account-demo-note">Demo experience only · No authentication service is connected.<br />Your password is used only for this form validation and is never stored.</div><div className="account-explore"><span>Just looking around?</span><Link to="/discover">Browse events without an account <ArrowRight size={15} /></Link></div></div></main>
}

const faqs = [
  ['How do I book an event?', 'Choose an event, select your ticket type and quantity, then add the tickets to your cart. The checkout is a front-end demonstration only.'],
  ['Are these real events and tickets?', 'No. Event listings, availability, prices, booking references, and tickets on this portfolio site are sample data for demonstration purposes.'],
  ['Does checkout take payment?', 'No payment is connected or collected. Never enter card or banking information. The demo booking only uses the contact details you enter to show a complete sample flow.'],
  ['Can I save events for later?', 'Yes. Use the heart button on any event card or event page. Saved event IDs are stored in your browser so they remain after refresh.'],
  ['Where are events taking place?', 'Sample listings include Lagos, Abuja, Port Harcourt, Ibadan, Enugu, Benin City, and Kano. You can explore all 36 states and the FCT using the location filter.'],
]
export function HelpPage() {
  const [openFaq, setOpenFaq] = useState(0)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const submit = (event: FormEvent) => { event.preventDefault(); setSent(true); setMessage('Thanks for reaching out. This demo form does not send or store messages.') }
  return <main className="help-page page-shell"><div className="page-intro help-intro"><div className="eyebrow">HERE IF YOU NEED US</div><h1>Questions? <em>We’ve got you.</em></h1><p>A few answers about finding events, booking tickets, and what this demo can do.</p></div><div className="help-layout"><section className="faq-section" id="booking"><div className="eyebrow">THE THINGS YOU’RE WONDERING</div><h2>A few useful answers.</h2><div className="faq-list">{faqs.map(([question, answer], index) => <article className={`faq-item ${openFaq === index ? 'faq-open' : ''}`} key={question}><button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span>{question}</span><span>{openFaq === index ? '−' : '+'}</span></button>{openFaq === index && <p>{answer}</p>}</article>)}</div><div className="demo-help-note" id="demo"><CircleHelp size={18} /><p><strong>A note about this portfolio demo</strong><br />No real payment, ticket delivery, authentication, or support service is connected. Event and inventory details are sample data.</p></div></section>
    <aside className="contact-panel"><span className="contact-panel-icon"><Users size={20} /></span><div className="eyebrow">SOMETHING ELSE?</div><h2>Drop us a note.</h2><p>Use the demo form to explore the interaction. It won’t send a message anywhere.</p><form onSubmit={submit} className="contact-form"><label className="form-field">Your name<input required minLength={2} placeholder="Your name" /></label><label className="form-field">Email address<input required type="email" placeholder="you@example.com" /></label><label className="form-field">What’s on your mind?<textarea required minLength={8} rows={4} placeholder="Tell us a little more..." /></label><button className="button button-primary" type="submit" disabled={sent}>{sent ? <>Message noted <Check size={16} /></> : <>Send a demo message <ArrowRight size={16} /></>}</button>{message && <span role="status" className="contact-feedback">{message}</span>}</form></aside></div><div className="help-location"><MapPin size={18} /><span>Eventra is built around experiences across Nigeria.</span><Link to="/discover">Explore by location <ArrowRight size={15} /></Link></div></main>
}
