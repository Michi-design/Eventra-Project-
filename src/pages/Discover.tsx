import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowDownWideNarrow, ArrowRight, SlidersHorizontal, X } from 'lucide-react'
import { categories, events, formatNaira, getEventStartDate, states } from '../data'
import { EventGrid, SearchBar, SectionHeading } from '../components'
import { useApp } from '../store'

export function Discover() {
  const [params, setParams] = useSearchParams()
  const { location, setLocation } = useApp()
  const [showFilters, setShowFilters] = useState(false)
  const query = params.get('q') || ''
  const category = params.get('category') || ''
  const selectedLocation = params.get('location') || (location === 'All locations' ? '' : location)
  const date = params.get('date') || ''
  const min = params.get('min') || ''
  const max = params.get('max') || ''
  const sort = params.get('sort') || 'date'
  const update = (key: string, value: string) => { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); setParams(next) }
  const filtered = useMemo(() => {
    const results = events.filter((event) => (!query || `${event.title} ${event.category} ${event.city} ${event.venue}`.toLowerCase().includes(query.toLowerCase())) &&
      (!category || event.category === category) && (!selectedLocation || event.state === selectedLocation || event.city === selectedLocation) &&
      (!date || event.date >= date) && (!min || event.price >= Number(min)) && (!max || event.price <= Number(max)))
    return results.sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : sort === 'popular' ? Number(b.popular) - Number(a.popular) : a.date.localeCompare(b.date))
  }, [query, category, selectedLocation, date, min, max, sort])
  const clearFilters = () => { setParams({}); setLocation('All locations') }
  return <main className="page-shell discovery-page"><div className="page-intro"><div className="eyebrow">THE GOOD STUFF, ALL IN ONE PLACE</div><h1>Find your next<br /><em>favourite thing.</em></h1><p>Browse experiences from across Nigeria, then pick the one that feels like you.</p><SearchBar key={query} initial={query} onSearch={(value) => update('q', value)} /></div>
    <div className="discovery-toolbar"><div className="result-count"><strong>{filtered.length}</strong> {filtered.length === 1 ? 'experience' : 'experiences'} to explore</div><div className="toolbar-controls"><button className={`filter-toggle ${showFilters ? 'active' : ''}`} type="button" onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={16} /> Filters</button><label className="sort-control"><ArrowDownWideNarrow size={16} /><span className="sr-only">Sort events</span><select value={sort} onChange={(e) => update('sort', e.target.value)}><option value="date">Soonest first</option><option value="popular">Most popular</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label></div></div>
    {showFilters && <div className="filter-panel"><label>Category<select value={category} onChange={(e) => update('category', e.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Location<select value={selectedLocation} onChange={(e) => { update('location', e.target.value); setLocation(e.target.value || 'All locations') }}><option value="">All locations</option>{states.map((state) => <option value={state} key={state}>{state === 'Federal Capital Territory' ? 'Abuja, FCT' : state}</option>)}</select></label><label>From date<input type="date" value={date} onChange={(e) => update('date', e.target.value)} /></label><label>Min price (₦)<input type="number" min="0" step="1000" value={min} placeholder="0" onChange={(e) => update('min', e.target.value)} /></label><label>Max price (₦)<input type="number" min="0" step="1000" value={max} placeholder="Any" onChange={(e) => update('max', e.target.value)} /></label></div>}
    {(query || category || selectedLocation || date || min || max) && <div className="active-filters">{([['q', query && `“${query}”`], ['category', category], ['location', selectedLocation], ['date', date && `From ${date}`], ['min', min && `From ${formatNaira(Number(min))}`], ['max', max && `Up to ${formatNaira(Number(max))}`]] as [string, string | false][]).filter(([, label]) => Boolean(label)).map(([key, label]) => <span key={key}>{label}<button type="button" onClick={() => { update(key, ''); if (key === 'location') setLocation('All locations') }} aria-label={`Remove ${String(label)} filter`}><X size={13} /></button></span>)}<button type="button" className="clear-filter-button" onClick={clearFilters}>Clear all</button></div>}
    <EventGrid items={filtered} />
    <div className="discovery-note"><span>Thoughtfully gathered, just for you.</span><Link to="/about">How Eventra works <ArrowRight size={15} /></Link></div>
  </main>
}

export function NextPage() {
  const now = new Date()
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const future = events.filter((event) => getEventStartDate(event) >= now).sort((a, b) => a.date.localeCompare(b.date))
  const soon = future.slice(0, 3)
  const thisWeekend = future.filter((event) => { const days = (new Date(`${event.date}T12:00:00`).getTime() - today.getTime()) / 86400000; return days >= 0 && days <= 8 && !soon.includes(event) })
  const later = future.filter((event) => !thisWeekend.includes(event) && !soon.includes(event))
  return <main className="page-shell next-page"><div className="page-intro next-intro"><div className="eyebrow">THE FUTURE LOOKS GOOD</div><h1>What’s <em>next?</em></h1><p>Make a little space in your calendar. Here are a few good reasons to.</p></div><section className="section-block"><SectionHeading eyebrow="UP AHEAD" title="Happening soon" description="Your next few good plans, sorted." /><EventGrid items={soon} /></section><section className="section-block next-weekend"><SectionHeading eyebrow="SAVE THE DATE" title="This weekend & soon" description="Make the weekend a little less ordinary." /><EventGrid items={thisWeekend} /></section><section className="section-block"><SectionHeading eyebrow="A LITTLE FURTHER OUT" title="Coming up next" description="Good things worth looking forward to." /><EventGrid items={later} /></section></main>
}
