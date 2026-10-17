import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartItem, DemoBooking } from './data'

type AppState = {
  saved: string[]; cart: CartItem[]; booking: DemoBooking | null; location: string; toast: string
  toggleSaved: (id: string) => void; addToCart: (items: CartItem[]) => void; updateCart: (eventId: string, ticketId: string, quantity: number) => void
  removeCartItem: (eventId: string, ticketId: string) => void; clearCart: () => void; setBooking: (booking: DemoBooking) => void
  setLocation: (location: string) => void; notify: (message: string) => void
}
const Context = createContext<AppState | null>(null)
const read = <T,>(key: string, fallback: T): T => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback } catch { return fallback }
}
export function AppProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<string[]>(() => read('eventra-saved', []))
  const [cart, setCart] = useState<CartItem[]>(() => read('eventra-cart', []))
  const [booking, setBookingState] = useState<DemoBooking | null>(() => read('eventra-booking', null))
  const [location, setLocation] = useState(() => read('eventra-location', 'All locations'))
  const [toast, setToast] = useState('')
  useEffect(() => localStorage.setItem('eventra-saved', JSON.stringify(saved)), [saved])
  useEffect(() => localStorage.setItem('eventra-cart', JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem('eventra-location', JSON.stringify(location)), [location])
  useEffect(() => { if (booking) localStorage.setItem('eventra-booking', JSON.stringify(booking)) }, [booking])
  useEffect(() => { if (toast) { const timer = window.setTimeout(() => setToast(''), 2600); return () => window.clearTimeout(timer) } }, [toast])
  const value = useMemo<AppState>(() => ({
    saved, cart, booking, location, toast,
    toggleSaved: (id) => { setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); setToast(saved.includes(id) ? 'Removed from saved events' : 'Saved for later') },
    addToCart: (items) => { setCart((current) => { let next = [...current]; items.forEach((item) => { const index = next.findIndex((row) => row.eventId === item.eventId && row.ticketId === item.ticketId); if (index >= 0) next[index] = { ...next[index], quantity: next[index].quantity + item.quantity }; else next.push(item) }); return next }); setToast('Tickets added to your cart') },
    updateCart: (eventId, ticketId, quantity) => setCart((current) => current.map((item) => item.eventId === eventId && item.ticketId === ticketId ? { ...item, quantity } : item).filter((item) => item.quantity > 0)),
    removeCartItem: (eventId, ticketId) => setCart((current) => current.filter((item) => item.eventId !== eventId || item.ticketId !== ticketId)),
    clearCart: () => setCart([]), setBooking: setBookingState, setLocation: (next) => { setLocation(next); localStorage.setItem('eventra-location', JSON.stringify(next)) }, notify: setToast,
  }), [saved, cart, booking, location, toast])
  return <Context.Provider value={value}>{children}</Context.Provider>
}
export const useApp = () => { const value = useContext(Context); if (!value) throw new Error('useApp must be used within AppProvider'); return value }
