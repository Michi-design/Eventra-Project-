# Eventra

Eventra is a responsive event-discovery and ticket-booking front-end concept for the Nigerian market. It brings together sample events, location and category discovery, saved events, a persistent booking cart, and a complete demo checkout journey.

> **Demo only:** Event listings, prices, availability, bookings, and tickets are sample data. No payment processing, authentication, ticket delivery, email subscription, or backend booking service is connected. Never enter payment credentials.

## Features

- Browse and search events by category, location, date, and price; sort by date, popularity, or price.
- Explore upcoming events, event details, ticket types, schedules, and attendee notes.
- Filter by any of Nigeria's 36 states and the Federal Capital Territory.
- Save events and keep a booking cart across refreshes with browser LocalStorage.
- Update ticket quantities, review calculated subtotals, and complete a validated demo checkout.
- View a sample confirmation and clearly labelled, non-scannable demo ticket.
- Visit About, Help/FAQs, and demo account pages.
- Responsive layouts, keyboard-visible focus, form labels, empty states, and reduced-motion support.

## Technology

- React 18 and TypeScript
- Vite
- React Router
- Lucide React
- Modern CSS with shared design tokens
- LocalStorage for demo saved events, cart, location, and the most recent demo booking

## Project structure

```text
src/
  App.tsx                 Routes and application shell
  components.tsx          Shared navigation, event cards, search, and footer
  data.ts                 Typed sample events, ticket data, and formatters
  store.tsx               Shared app state and LocalStorage persistence
  styles.css              Design system, components, and responsive layouts
  pages/
    Home.tsx               Homepage and curated event sections
    Discover.tsx           Search, filters, sorting, and upcoming events
    EventDetail.tsx        Event information and ticket selection
    Commerce.tsx           Cart, checkout, confirmation, and sample ticket
    Content.tsx            About, demo account, and Help/Contact
```

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create and preview a production build:

```bash
npm run build
npm run preview
```

## Demo booking journey

1. Open an event and select one or more ticket quantities.
2. Add tickets to the cart, then adjust or remove cart items as needed.
3. Enter a name, email, and phone number in checkout.
4. Review and confirm the clearly labelled demo booking.
5. View the sample confirmation and demo ticket.

The booking reference is generated in the browser. The displayed ticket is not a valid admission credential, its QR-style area is a non-scannable illustration, and no payment details are requested or processed.

## Environment configuration

No environment variables or external service credentials are required. Event imagery is loaded from Unsplash URLs, so those images require an internet connection. A fallback image is used if an event-card image fails to load.

## Testing

Run `npm run build` for TypeScript and production-build validation. The current project does not include a separate automated test runner. Manually verify core routes, query filters, LocalStorage persistence, responsive widths, image loading, and the booking flow in a browser.

## Production integration still needed

A production ticketing platform would need a backend event and inventory API, user authentication, server-side booking validation, payment-provider integration, secure order storage, ticket issuance and verification, transactional email, organizer tooling, privacy and terms policies, and operational support. This portfolio front end does not implement those services.
