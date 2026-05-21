# Design Specification: Customer Comeback Machine

## 1. Visual Identity & Brand Tone
- **Tone:** Warm, friendly, trustworthy, modern, and simple.
- **Audience:** Non-technical small business owners (boutiques, salons, coffee shops).
- **Style:** Clean layouts, rounded corners, soft shadows, plenty of white space.

## 2. Color Palette
- **Primary (Action):** `#F59E0B` (Amber-500) - Represents energy, warmth, and "coming back."
- **Secondary (Trust):** `#1E293B` (Slate-800) - For typography and headers to provide a professional foundation.
- **Success:** `#10B981` (Emerald-500) - For positive metrics and confirmations.
- **Backgrounds:**
  - Base: `#FFFFFF` (White)
  - Subtle: `#FFFBEB` (Amber-50) or `#F8FAFC` (Slate-50) for section backgrounds.

## 3. Typography
- **Primary Font:** Inter or Outfit (Sans-serif).
- **Headings:** Bold, friendly, slightly larger line heights.
- **Body:** Clean, legible, high contrast.

## 4. UI Components (Tailwind CSS)

### Navbar
- Sticky top, `bg-white/80 backdrop-blur-md`.
- Logo on the left, navigation links centered, "Get Started" CTA on the right.

### Hero Section
- Centered or Split-screen.
- **Headline:** `text-5xl font-bold tracking-tight text-slate-900`.
- **Subheadline:** `text-xl text-slate-600 mt-6`.
- **CTA Button:** `bg-amber-500 text-white hover:bg-amber-600 px-8 py-4 rounded-xl font-semibold`.

### Pricing Cards
- `border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow`.
- "Growth" plan highlighted with a `ring-2 ring-amber-500`.

### Customer Opt-in Page (Public)
- Clean, focused on the business branding.
- Large input fields with `rounded-lg border-slate-300`.
- Friendly "Join the Club" button.

### Free Tool UI
- Step-by-step wizard or a single clean form.
- Interactive cards for business type selection.
- Result section with "Copy to Clipboard" buttons for the generated messages.

## 5. Next Steps
- Waiting for the architect to set up the Next.js foundation.
- I will then create a `/components` directory with reusable UI elements:
  - `Button.tsx`
  - `Card.tsx`
  - `Input.tsx`
  - `Container.tsx`
  - `Heading.tsx`
- I'll implement the pages in `/app` (Landing, Pricing, Opt-in, Free Tool).
