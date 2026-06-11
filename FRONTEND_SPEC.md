# Frontend Specification: Kick Stream

## Overview
Kick Stream is a modern React-based web application for streaming football matches, offering user plans, direct WhatsApp contact for purchases, and an admin dashboard for monitoring user activity and messages

---

## 1. Tech Stack
- **Framework:** React 18 (with functional components and hooks)
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Animation:** Framer Motion
- **Build Tool:** Vite

---

## 2. Main Structure
- **src/App.jsx**: Main entry for the user-facing site, sets up routing and renders all public components.
- **src/main.jsx**: Mounts the React app and analytics tracker.
- **src/components/**: Contains all UI components (Hero, Pricing, FAQ, etc.).
- **src/admin/**: Contains admin dashboard and related components.

---

## 3. User-Facing Pages & Components
- **Nav**: Top navigation bar with links to sections.
- **Hero**: Eye-catching landing section with animated video background and main headline.
- **TrustBar, ProductReveal, HowItWorks, Stats, Testimonials, LiveMatchTicker, FAQ, FinalCTA**: Themed sections for marketing, information, and engagement.
- **Pricing**: Displays available plans. Each plan's CTA redirects to WhatsApp with a pre-filled message to the admin's number for purchase.
- **ContactAdmin**: Modern, branded contact form for users to send messages to the admin. Placed just before the footer.
- **Footer**: Contains navigation, social links, and legal info.

---

## 4. Routing
- **/**: Main public site (all sections above)
- **/admin**: Protected admin dashboard route (login required)

---

## 5. Admin Dashboard
- **Login**: Username/password form (hardcoded credentials, localStorage-based session)
- **Dashboard**: After login, admin can:
  - View all users (from localStorage, tracked by email/visits)
  - See analytics (most clicked elements, tracked via localStorage)
  - Read emails sent by users (from ContactAdmin, stored in localStorage)
  - Logout (clears session)

---

## 6. Analytics
- **AnalyticsTracker**: Global component that tracks clicks on elements with `data-analytics` attributes and stores events in localStorage for admin review.

---

## 7. Styling & UX
- **Theme:** Dark, modern, and branded (custom colors, gradients, rounded corners, glassmorphism, etc.)
- **Animations:** Framer Motion for smooth transitions and section reveals.
- **Responsiveness:** All components are mobile-friendly and responsive.

---

## 8. Data Flow
- **No backend:** All user data, analytics, and emails are stored in localStorage for demo purposes.
- **WhatsApp integration:** Plan purchase CTAs open WhatsApp with a pre-filled message to the admin's number.

---

## 9. Extensibility
- **Backend Ready:** The structure allows for easy integration of real authentication, database, and email services.
- **Componentized:** All UI is modular and easy to extend or theme.

---

## 10. Security Note
- **Admin credentials are hardcoded and stored in localStorage for demo only.**
- For production, replace with real authentication and secure storage.

---

## 11. File Map (Key Files)
- src/App.jsx — Main app and routing
- src/main.jsx — App mount
- src/components/Nav.jsx, Hero.jsx, Pricing.jsx, ContactAdmin.jsx, etc.
- src/admin/AdminDashboard.jsx, AdminLogin.jsx, AdminUsers.jsx, AdminAnalytics.jsx, AdminEmails.jsx
- src/components/AnalyticsTracker.jsx — User activity tracking
- tailwind.config.js, postcss.config.js — Styling config
- vite.config.js — Build config

---

## 12. How to Run
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Visit: `http://localhost:5173/`
- Admin dashboard: `http://localhost:5173/admin` (login required)

---

## 13. Credentials (Demo Only)
- Username: `admin`
- Password: `kickstream2026`

---

## 14. Future Improvements
- Real backend for users, analytics, and email
- OAuth or JWT-based admin authentication
- Real-time analytics and charts
- Payment gateway integration
- Email notifications

---

This spec describes the current frontend architecture, features, and usage for Kick Stream.
