# Momence adult booking audit (Aspen Tennis Academy)

Audited 22 Oct 2026 from the public Momence booking page, following the guest flow up to the checkout screen. No booking was made and no personal or payment data was entered.

## 1. The flow, step by step

1. **Schedule page (host page).** A Sunday-to-Saturday week strip with previous/next arrows. Days that have classes are marked. A "Show all" button clears the day filter. Two dropdown filters: location (Arbor Park, Aspen) and tag (drill type, e.g. Drop Shot Divas, Open Friday, Mix Drill). A note says times are shown in the host timezone (Central, Chicago).
2. **Class cards**, grouped by date. Each card shows: class name, instructor, program line (e.g. "Aspen Tennis Academy Fall Team Drills"), level badge when set (e.g. 3.0-3.5), start and end time, duration, location, price, and a "Book now" button. Cancelled classes stay on the list, greyed out, with no booking action.
3. **Class page.** Description (often a level guide), date, time, duration, location, instructor, price, and a ticket selector.
4. **Checkout (guest allowed).** Name, email, phone. Ticket line ("Ticket x 1"). Promo code field. Payment method choice (card, ACH direct debit; the ACH option showed a $0.00 processing fee). A checkbox to save the method for one-click checkout. Pay button.
5. **Confirmation** by email (not observed, since no booking was made).

## 2. Data the platform exposes per class

| Field | Example |
|---|---|
| Title | Open Friday Drill |
| Date, start, end, duration | Fri Oct 23, 9:00-10:30 AM, 90 min |
| Instructor | Ashlee Gardner |
| Location | Arbor Park / Aspen |
| Tag / category | Drop Shot Divas, Open Friday, Mix Drill |
| Level | 3.0-3.5, 2.5-3.0, 3.5 & higher |
| Program / series line | Fall Team Drills, Women's Drills |
| Price | $24-$35 |
| Status | open / cancelled |
| Description | level guide text (some blank) |

## 3. What the prototype now mirrors

- Book tab (Adult): week strip, Show all, location and drill filters, date-grouped class cards, level badges, cancelled state, Central-time note. Junior list unchanged.
- Class page: date, time with duration, location, coach, level, program, cancelled banner (booking disabled), "Book for" family member selector.
- Cart/checkout: ticket line, promo code (demo code DEMO10 = 10% off, anything else is rejected), card or ACH choice with $0.00 fee, one-click checkout toggle. Booked class appears on Home with its real date and time.
- About page (`/about`), linked from Profile and Home.

Where we intentionally differ from Momence: one login for the whole family, one cart for several members, saved payment, and no guest checkout.

## 4. What this means for the admin dashboard

**Schedule management**
- Create and edit class occurrences (date, start, end, duration, location, instructor, price, capacity, level, tag, program, description).
- Recurring series (weekly drills) with edit-one vs edit-all.
- Cancel an occurrence: keep it visible as "Cancelled", block booking, notify booked players, refund or credit.
- Duplicate last week's schedule forward.

**Reference data to manage**: locations (Arbor Park, Aspen), tags/teams, levels, instructors, programs.

**Bookings and attendees**
- Per-class roster with level, family member, payment status; add or remove a player; check-in.
- Waitlist and capacity (not visible publicly on Momence, so ask Ashlee).

**Money**
- Pricing per class and per series; promo codes (percent/amount, expiry, usage limit); payment methods and fees (card vs ACH); refunds and credits; payouts reporting.

**Customers**: accounts, families, level history, one-click checkout on/off, contact info, notes.

**Settings**: timezone, branding, notification templates (confirmation, cancellation, reminder), About page content.

## 5. Open questions for Ashlee

1. Capacity per class, and is there a waitlist?
2. Cancellation policy: refund, credit, or nothing, and what is the cutoff?
3. Do you use class packs or memberships, or only single-class tickets?
4. Who sets a player's level, and can anyone book any level?
5. What is the "Team Drill" tag system for, and do teams book as a group?
6. Do you want guest checkout, or must players have an account?
7. Which promo codes do you use today?
8. Do you want ACH offered (it avoids card fees)?
9. Should Junior programs follow the same dated-class model?
10. What reports do you rely on today (attendance, revenue, retention)?
