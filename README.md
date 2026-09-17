# Aspen Tennis Academy — Unified App Prototype

A clickable React prototype for a unified family booking app: one login for adult
classes and junior camps, one shared cart, one checkout.

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- React Router (HashRouter, so it works from any static host with no server config)
- Framer Motion for screen transitions
- lucide-react for icons

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Building for deployment

```bash
npm run build
```

Outputs a standard static site to `dist/` — deploy it anywhere (Vercel, Netlify,
GitHub Pages, etc.). Because routing uses `HashRouter`, no server-side rewrite
rules are needed.

## Project structure

```
src/
  components/
    ui/        Reusable primitives: Button, Card, Badge, Avatar, Input, etc.
    layout/    AppShell (phone frame + transitions), BottomNav, ScreenHeader
  context/
    AppState.tsx   In-memory app state: family members, cart, upcoming bookings
  data/
    mockData.ts    Seed content: sessions, family members, payment method
  pages/
    Landing, SignUp, SignIn, ForgotPassword
    Home, Book, SessionDetail
    Family, FamilyMemberDetail, AddFamilyMember
    Cart, BookingConfirmation
    Profile, EditProfile, PaymentMethods, Notifications, HelpSupport, AppPreferences
```

## Notes

- All data is mock/in-memory (`src/context/AppState.tsx`) — there is no backend.
  Booking a session, adding a family member, etc. all update local React state
  and reset on page refresh. Wire up a real API by replacing the functions in
  `AppState.tsx`.
- Brand colors, the mountain mark, and copy are defined inline in each page and
  in `src/index.css` (`--color-navy-*`, `--color-pine-*`, `--color-gold-*`).
  Update those tokens to restyle the whole app at once.
