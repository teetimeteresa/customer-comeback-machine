# Owner HQ — PWA Assessment & Implementation Plan

**Date:** 2026-06-18
**Prepared for:** Customer Comeback Machine Team / Owner

---

## 1. Executive Summary

Turn the existing Next.js dashboard into a Progressive Web App (PWA) so business owners can "Add to Home Screen" on their phones and access Owner HQ like a native app. The current codebase (Next.js 15, Tailwind CSS 3.4, App Router) is well-suited for PWA conversion — minimal effort, high impact.

**Estimated effort:** 3–4 hours total
**Difficulty:** Low–Medium
**Dependencies:** None beyond existing tooling

---

## 2. Current State Assessment

| Area | Status | Notes |
|------|--------|-------|
| **Framework** | ✅ Next.js 15.5.18 (App Router) | Excellent PWA support, built-in metadata API |
| **Mobile Responsiveness** | ⚠️ Partial | Sidebar uses `fixed w-64` — does not collapse on mobile. Dashboard pages need `ml-64` adjustment for mobile. |
| **PWA Manifest** | ❌ Missing | No `manifest.json` — required for "Add to Home Screen" |
| **Service Worker** | ❌ Missing | No offline caching strategy |
| **PWA Icons** | ❌ Missing | Only `favicon.ico` exists. Need 192x192 and 512x512 app icons |
| **HTTPS** | ✅ Yes (on Vercel/deployed) | Required for service workers in production |
| **Dashboard Pages** | ✅ 6 views exist | Home, Customers, Campaigns, QR Sign, Settings, Admin |
| **Push Notifications** | ❌ Not yet (Phase 2) | Requires service worker + permission flow + notification API |

---

## 3. Implementation Phases

### Phase 1: Mobile Responsiveness (1 hour)

The sidebar is the biggest mobile UX blocker. Currently it's a fixed 256px panel.

**Changes needed:**

1. **Create a responsive Sidebar wrapper** (`src/components/Sidebar.tsx`):
   - On desktop (`md:` and up): show fixed sidebar as currently
   - On mobile: hide behind a hamburger toggle button
   - Use a `bottom-nav` style bar for quick navigation on phones

2. **Layout wrapper** (`src/app/dashboard/layout.tsx`):
   - Move sidebar into a shared layout so all dashboard pages inherit it
   - Add responsive padding: `md:ml-64` for desktop, full width for mobile

3. **Mobile nav bar** (persistent bottom tab bar for phones):
   - Dashboard, Customers, Campaigns, Settings icons

### Phase 2: PWA Icons & Manifest (30 min)

**Icons needed** (place in `public/`):
- `icon-192x192.png` — 192×192 PNG (amber #F59E0B background, white "C" logo)
- `icon-512x512.png` — 512×512 PNG (same design; used for splash screen)

**Manifest** (`public/manifest.json`):
```json
{
  "name": "Owner HQ — Customer Comeback Machine",
  "short_name": "Owner HQ",
  "description": "Manage your customer retention from anywhere",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#F59E0B",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Phase 3: Manifest & Meta Tags (15 min)

Update `src/app/layout.tsx` metadata export:
```tsx
export const metadata: Metadata = {
  // ... existing ...
  manifest: '/manifest.json',
  themeColor: '#F59E0B',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Owner HQ',
  },
};
```

Also add apple-touch-icon link in the `<head>`:
```tsx
// In root layout
<link rel="apple-touch-icon" href="/icon-192x192.png" />
```

### Phase 4: Service Worker (1 hour)

**Approach:** Manual service worker (NOT `next-pwa` package — has compatibility issues with Next.js 15 App Router).

**File:** `public/sw.js`

```javascript
const CACHE_NAME = 'owner-hq-v1';
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Install: cache core app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
});

// Fetch: network-first for API, cache-first for static
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls: network first, fall back to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets: cache first
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|ico|woff2?|css|js)$/)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Navigation: network first
  event.respondWith(networkFirst(request));
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch {
    return caches.match(request);
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}
```

**Registration** — add a `useEffect`-based component or script in the root layout:
```tsx
// Register service worker (client-side only)
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
}, []);
```

### Phase 5: Push Notifications (Future — Phase 2)

Not required for MVP but planned for long term:
1. Add `vapidPublicKey` to manifest
2. Subscribe user on login (requires user permission)
3. Send notifications via a backend endpoint (`/api/notifications/send`)
4. Display notifications for: new customer signup, campaign sent, low review score

---

## 4. Effort Breakdown

| Phase | Task | Time | Who |
|-------|------|------|-----|
| 1 | Mobile sidebar + bottom nav | 1 hr | Developer |
| 2 | Generate icons + manifest.json | 30 min | Designer/Dev |
| 3 | Update metadata in layout | 15 min | Developer |
| 4 | Service worker + registration | 1 hr | Developer |
| 5 | Push notifications (Phase 2) | 2-3 hrs | Developer |
| **Total** | | **~3 hrs (Phase 1-4)** | |

---

## 5. Risks & Considerations

1. **Service Worker Scope:** SW only works on same-origin. If deployed on Vercel, the `/dashboard` scope applies to all sub-pages automatically
2. **Offline Limitations:** Dashboard data requires API calls — offline mode shows cached shell but stale data. This is acceptable for an MVP
3. **iOS Safari:** PWA support exists but is more limited (no push notifications on iOS). The "Add to Home Screen" flow works
4. **Cache Updates:** Version the cache name (`owner-hq-v1`, `owner-hq-v2`) on each deploy to force re-cache
5. **Existing Icons:** Need a designer to create the 192/512 icons matching the brand style (amber sparkles logo)

---

## 6. Recommended Go-First Approach

**Minimum Viable PWA (~1.5 hours):**
1. Create `icon-192x192.png` and `icon-512x512.png` (grab the existing sparkles logo, resize)
2. Create `public/manifest.json` with the config above
3. Update `layout.tsx` metadata to link manifest
4. Create `public/sw.js` with the basic caching strategy
5. Register the service worker in a client component

This gives the owner "Add to Home Screen" capability and basic offline support. The mobile sidebar overhaul (Phase 1) can be done in a separate sprint.