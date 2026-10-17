# Eventra — portfolio notes

## The problem

Finding an event that fits a person's interests, location, budget, and schedule can mean searching across disconnected listings. Eventra explores a single, approachable place to discover experiences and understand what booking would involve.

## Target users

The interface is designed for people in Nigeria looking for concerts, nightlife, festivals, comedy, conferences, workshops, art and culture, food experiences, networking, and sports. This audience definition is a product-design assumption, not the result of user research.

## Key UX decisions

- Lead with a lightweight search and a warm editorial presentation instead of a dashboard.
- Allow visitors to browse without an account; keep account entry separate from the core event journey.
- Keep category, location, date, and price filters close to search results.
- Surface event date, venue, city, and starting price on cards; provide schedule and attendee notes on detail pages.
- Use a shared saved-event/cart state and browser persistence to make a multi-page demo journey coherent.
- Show booking costs from actual ticket quantities and prices. No unlabelled service fee is added.
- Clearly identify sample inventory, demo checkout, sample references, and non-valid tickets rather than implying real ticketing services.

## Main user journeys

1. Discover events from the home page, category links, search, or city selection.
2. Narrow listings by category, location, date, and price, then sort the results.
3. Review an event's details, schedule, organizer, and ticket options.
4. Save an event or add tickets to a persistent cart.
5. Validate contact details, confirm the demo booking, and inspect the sample ticket.
6. Browse About and Help content, or view the demo-only account form.

## Reusable components and design system

The UI uses a shared header, location selector, event card/grid, search form, section heading, empty state, footer, and feedback toast. Typed sample data is centralized, while shared helpers format naira and event dates. CSS custom properties define the core palette and layout width; shared classes establish type, spacing, borders, and button behaviour.

## Responsive design

Desktop layouts use a centered content width, multi-column event cards, expanded navigation, and a sticky ticket summary. Tablet widths reduce grid columns. Mobile layouts use a menu panel, two-column event cards, compact controls, and single-column forms and commerce pages. Reduced-motion preferences and a print layout for the sample ticket are included.

## Accessibility considerations

The UI uses semantic landmarks and form labels, accessible names for icon-only actions, pressed/expanded states for key controls, visible keyboard focus, inline form feedback, and `role=status` notifications. Motion is reduced when the system requests it. The location chooser uses a searchable input and keyboard-operable native controls.

## Front-end features demonstrated

- Event search, filtering, sorting, and shareable query-string filters.
- Nigerian state/FCT location choices.
- Event detail and ticket quantity selection with limits.
- Persisted saved event IDs and cart line items.
- Validated demo checkout and a sample booking confirmation.
- Clear demo-only account, contact, newsletter, payment, and ticket behaviour.

## What remains for production

The sample event catalog, ticket availability, prices, cart, and booking are client-side demonstration data. Production would require a secured API and database, live inventory and concurrency handling, authentication, a payment-provider integration, verified ticket issuance/scan validation, transactional notifications, privacy/terms review, analytics with appropriate consent, organizer and support workflows, and broader automated and manual testing. No user interviews, usability findings, business metrics, or production partnerships are claimed by this project.
