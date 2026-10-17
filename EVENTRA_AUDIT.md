# Eventra portfolio-readiness audit

**Audit date:** 17 October 2026 (re-verified at 10:56 +01:00)  
**Scope:** Existing React + TypeScript + Vite implementation in this workspace. The established visual design was preserved; changes were limited to confirmed functional defects.

## Results at a glance

| # | Feature area | Status | Verified result | Recommended follow-up |
|---|---|---|---|---|
| 1 | Pages and navigation | **PASS** | Home, Discover, Next, Saved, Cart, Checkout, Confirmation, Ticket, About, Help, Account, and event detail routes loaded. A missing event and unknown route displayed their intended fallback states. Internal navigation links tested for their routes, including category navigation. | No current route fix needed. Add automated route smoke tests when a test runner is introduced. |
| 2 | Search, categories, filters, and sorting | **PASS** | Category selection returned matching results; searching “Laugh” found its event; date and price filters combined correctly; no-match results showed an empty state; Clear all restored all 10 events. Price ascending began with “Build North: Founders Meetup”; descending began with “The Abuja Supper Club.” | No confirmed defect remains. Add automated tests for filter combinations and URL query behavior. |
| 3 | Nigerian locations | **PASS** | Selector exposed 38 choices: All locations plus all 36 states and the FCT. “Rivers” search and selection worked and persisted. Abuja and FCT searches each found the FCT option; selecting it showed Abuja and filtered to two matching events. | No current fix needed. Keep Abuja/FCT aliases when the location list changes. |
| 4 | Event details and ticket selection | **PASS** | Event detail showed event information, schedule, venue, organizer, and ticket options. Quantities and subtotals updated, and the per-type limit disabled further selection. Repeated additions to an existing cart now stop at the same limit. | **Sold-out presentation is NOT VERIFIED:** current event data contains no sold-out ticket. Add a sold-out fixture/test before relying on that branch. |
| 5 | Cart, totals, and persistence | **PASS** | Cart line quantities persisted after refresh, decrementing recalculated totals, removal worked, empty cart state appeared, and totals used naira formatting. Two Early Bird tickets plus two Regular tickets totaled ₦30,000. | No current fix needed. Add automated calculation tests for multiple events and ticket types. |
| 6 | Saved events | **PASS** | Saving updated the navigation count, persisted through refresh, and displayed the event on Saved. Empty Saved state also rendered correctly. | No current fix needed. |
| 7 | Checkout validation and demo confirmation | **PASS** | Empty fields produced three inline errors; invalid email and phone each produced useful field errors; valid details proceeded through review and created a demo booking. No payment information was requested. | Keep the demo-only notice prominent. Payment processing is intentionally not implemented. |
| 8 | Confirmation and sample ticket | **PASS** | Booking reference, attendee, event, ticket types, quantities, and total matched the completed booking. A two-ticket-type booking produced two sample tickets sharing the same booking reference. Booking and ticket remained available after refresh and were labelled as demo/sample. | No current fix needed. Ticket credentials and venue validation are intentionally not implemented. |
| 9 | Responsive layouts | **PASS** | All 12 main routes returned successfully at 320, 390, 768, and 1280 px (48 route/viewport checks); no horizontal overflow was found. Mobile menu exposed Discover and Saved Events. | Browser viewport checks do not replace physical-device and touch testing; see “Not verified.” |
| 10 | Controls, images, empty states, and runtime | **PASS** | Category and location dropdowns, mobile navigation, search, filters, sorting, saved/cart actions, and demo forms responded. Search, Saved, Cart, and Ticket empty states appeared. All 25 inspected images loaded. No fresh browser-console errors were observed during the active-server checks. | Remote Unsplash imagery requires a network connection. Offline and image-host failure behavior is not fully verified. |
| 11 | Build, imports, and editor diagnostics | **PASS** | `npm.cmd run build` completed successfully after the fixes. Workspace Problems reported no errors. No separate automated test runner is configured. | Run the build before publishing; consider adding a focused browser/unit test suite. |
| 12 | Sold-out inventory behavior | **NOT VERIFIED** | No current sample ticket is marked sold out, so the sold-out control state could not be exercised against data. | Add a clearly labelled sold-out sample ticket and test that it cannot be selected or added. |
| 13 | External production services | **NOT VERIFIED** | Real payments, authentication, email delivery/newsletter subscription, server-side booking persistence, and live ticket validation are not implemented. Demo flows explicitly disclose this. | Integrate and test production services only when backend/provider support is available. Do not present the current demo as production ticketing. |
| 14 | Physical devices, assistive technology, and offline imagery | **NOT VERIFIED** | Responsive sizes were checked in browser automation, but not on physical phones/tablets or with a screen reader. The inspected remote images loaded online; offline/static-image fallback was not tested for every image. | Manually test touch targets, keyboard/screen-reader flows, contrast, and image-host failure on target devices. Consider local image assets or a shared fallback for all editorial images. |

## Confirmed defects fixed

| Defect | Before | Fix and verification |
|---|---|---|
| Per-ticket purchase limit could be exceeded by revisiting an event | Added four Early Bird tickets twice; cart became 8 tickets and ₦96,000 despite a four-ticket limit. | Event detail now accounts for the quantity already in the cart and offers only the remaining allowance. Retest: two tickets in cart left two selectable; the final cart remained at four tickets and ₦48,000, and the add control disabled at the limit. |
| “Happening soon” events were repeated in “Coming up next” | On 17 October, all three “Happening soon” cards also appeared in “Coming up next.” A simulated 7 November run also found overlap with the “This weekend & soon” section. | Upcoming groups now exclude events already displayed in an earlier group. Retested on 17 October and at a simulated 7 November 21:00: no event appeared in more than one section. |
| Events remained listed as upcoming after their start time on the same day | Future lists compared only the event date to the end of that day. | Added a shared event-start date/time calculation for the homepage and Next page. At a simulated 7 November 21:00, the 20:00 “Laugh Lines” event no longer appeared on either page. |
| Searching “Abuja” could not find the FCT | Before the fix, searching Abuja returned zero location options. | The FCT option now includes Abuja and FCT search aliases while displaying its formal name. Retest found the option for Abuja and FCT; choosing it displayed Abuja and filtered to the two FCT events. |

## Validation notes

- Production build command: `npm.cmd run build` — passed on this re-audit.
- Re-audit loaded all 12 main pages plus missing-event and unknown-route fallbacks (all HTTP 200); all 25 inspected page images loaded, with no fresh browser-console errors.
- Responsive re-check covered all main routes at 320, 390, 768, and 1280 px (48 route/viewport combinations), with no horizontal overflow.
- Browser interaction checks included Abuja/FCT search, location persistence, category navigation, search, combined date/price/location/category filters, sorting, saved/cart persistence, checkout validation, and confirmation/ticket consistency.
- Re-tested the purchase cap at four tickets and used a simulated 7 November 21:00 clock to verify that already-started events disappear from upcoming lists and do not appear in multiple Next sections.
- Console-error status refers to fresh checks while Vite was running. Connection-refused messages from an earlier, stopped development server were not treated as application runtime errors.
- The project has no configured automated test runner; the interaction checks above were performed in the browser.
- Naira totals, sample booking references, and all event/inventory data are client-side demonstration data.

## Run commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

In PowerShell environments where the `npm` script is blocked by execution policy, use `npm.cmd` in place of `npm`.
