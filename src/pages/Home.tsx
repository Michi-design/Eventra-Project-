import { useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories, events, getEventStartDate } from '../data'
import { EventGrid, LocationPicker, Newsletter, SearchBar, SectionHeading } from '../components'
import { useApp } from '../store'

const categoryPhotos: Record<string, string> = {
  'Music & Concerts': 'photo-1501386761578-eac5c94b800a', Nightlife: 'photo-1470229722913-7c0e2dbbafd3', Festivals: 'photo-1533174072545-7a4b6ad7a6c3',
  Comedy: 'photo-1527224857830-43a7acc85260', Conferences: 'photo-1540575467063-178a50c2df87', Workshops: 'photo-1544367567-0f2fcb009e0b',
  'Art & Culture': 'photo-1531058020387-3be344556be6', 'Food & Drink': 'photo-1414235077428-338989a2e8c0', Networking: 'photo-1556761175-b413da4baf72', Sports: 'photo-1552674605-db6ffd4facb5',
}
const cities = [
  { name: 'Lagos', state: 'Lagos', image: 'photo-1517248135467-4c7edcad34c4', count: 'The city that never sits still' },
  { name: 'Abuja', state: 'Federal Capital Territory', image: 'photo-1519671482749-fd09be7ccebf', count: 'Something for every kind of day' },
  { name: 'Port Harcourt', state: 'Rivers', image: 'photo-1506157786151-b8491531f063', count: 'Find your next good night' },
  { name: 'Ibadan', state: 'Oyo', image: 'photo-1500530855697-b586d89ba3ee', count: 'A little closer to culture' },
  { name: 'Benin City', state: 'Edo', image: 'photo-1507525428034-b723cf961d3e', count: 'Make a weekend of it' },
  { name: 'Enugu', state: 'Enugu', image: 'photo-1492684223066-81342ee5ff30', count: 'Good things are happening here' },
]

export default function Home() {
  const { location, setLocation } = useApp()
  const [newsletterNote] = useState('A little inspiration, straight to your inbox. No noise.')
  const selectedEvents = events.filter((event) => location === 'All locations' || event.state === location)
  const upcomingEvents = selectedEvents.filter((event) => getEventStartDate(event) >= new Date())
  const featured = selectedEvents.filter((event) => event.featured).slice(0, 3)
  return <main>
    <section className="hero"><div className="hero-copy"><div className="hero-kicker"><span className="kicker-dot" /> MADE FOR YOUR NEXT GOOD DAY</div><h1>Find your<br /><em>kind of fun.</em></h1><p>From live music to long lunches, discover the experiences that make a day feel like yours.</p><SearchBar /><div className="hero-footnote"><Sparkles size={15} /> Good things are happening all around you</div></div>
      <div className="hero-visual"><img src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1500&q=90" alt="A crowd enjoying an outdoor live music event" /><div className="hero-image-shade" /><div className="hero-image-caption"><span className="caption-pulse" /><div><strong>Find the feeling</strong><small>Make space for a little more life</small></div></div><div className="hero-sticker"><span>your</span><strong>next<br />story</strong><span>starts here</span></div></div>
    </section>
    <section className="quick-discovery page-shell"><div className="quick-label"><span>01</span> START SOMEWHERE</div><div className="quick-control"><LocationPicker /><span className="quick-helper">Showing experiences around {location === 'All locations' ? 'Nigeria' : location === 'Federal Capital Territory' ? 'Abuja' : location}</span></div><Link to="/discover" className="quick-explore">Explore events <ArrowRight size={17} /></Link></section>
    <section className="section-block page-shell"><SectionHeading eyebrow="CURATED FOR YOU" title="A few good plans" description="A handpicked start to whatever you’re in the mood for." linkText="See everything" /><EventGrid items={featured.length ? featured : selectedEvents.slice(0, 3)} featured /></section>
    <section className="category-section"><div className="page-shell"><SectionHeading eyebrow="WHAT ARE YOU IN THE MOOD FOR?" title="Find your kind of fun" description="Pick a feeling. We’ll find the plans." /><div className="category-grid">{categories.map((category, index) => <Link className={`category-tile category-tile-${index % 5}`} key={category} to={`/discover?category=${encodeURIComponent(category)}`}><img src={`https://images.unsplash.com/${categoryPhotos[category]}?auto=format&fit=crop&w=700&q=80`} alt="" loading="lazy" /><span className="category-overlay" /><span className="category-index">0{index + 1}</span><strong>{category}</strong><ArrowRight size={18} /></Link>)}</div></div></section>
    <section className="section-block page-shell"><SectionHeading eyebrow="ON THE CALENDAR" title="Coming up around you" description="A little something to look forward to." linkText="View all events" /><EventGrid items={upcomingEvents.slice(0, 4)} /></section>
    <section className="location-section"><div className="page-shell"><SectionHeading eyebrow="GOOD THINGS, EVERYWHERE" title="Pick your city" description="The best plans don’t all happen in one place." /><div className="city-grid">{cities.map((city, index) => <button key={city.name} className={`city-tile city-tile-${index}`} type="button" onClick={() => { setLocation(city.state); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><img src={`https://images.unsplash.com/${city.image}?auto=format&fit=crop&w=750&q=80`} alt="" loading="lazy" /><span className="city-overlay" /><span className="city-caption"><strong>{city.name}</strong><small>{city.count}</small></span><ArrowRight size={17} /></button>)}</div></div></section>
    <section className="inspiration-band page-shell"><div className="inspiration-copy"><span className="eyebrow">A GOOD PLAN IS CLOSER THAN YOU THINK</span><h2>Make room for<br />a little more <em>life.</em></h2><p>Gather your people. Try something new. Turn an ordinary day into the one you keep talking about.</p><Link className="button button-light" to="/next">See what’s next <ArrowRight size={16} /></Link></div><div className="inspiration-art"><img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=85" alt="Friends sharing a lively meal around a table" loading="lazy" /><div className="art-stamp">GOOD<br />TIMES<br /><span>ahead</span></div></div></section>
    <section className="newsletter-section"><div className="page-shell newsletter-inner"><div><div className="eyebrow">THE EVENTRA EDIT</div><h2>Good plans, delivered.</h2><p>{newsletterNote}</p></div><Newsletter /></div></section>
  </main>
}
