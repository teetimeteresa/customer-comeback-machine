# Infrastructure Health Check Report
**Date:** 2026-06-29  
**Author:** agent-infrastructure-expert

---

## 1. System Overview

| Metric | Status |
|--------|--------|
| **Server** | Next.js dev server (v15.5.18) on port 3000 |
| **Memory** | 565Mi available (was 380Mi — **+185Mi freed**) |
| **CPU** | Moderate — `next-server` at ~1.3% CPU |
| **Port 3000** | ✅ Listening on `*:3000` |
| **Disk** | `.next/` build cache: 41MB — acceptable |

---

## 2. Production Build Status
- ✅ **Production build completed** on 2026-06-29 — 49 pages static, 14 API routes dynamic
- ✅ App switched from `next dev` to `next start` (production mode, listens on `*:3000`)
- ✅ Memory improved to **1.2Gi available** (production mode uses less memory)
- Next.js v15.5.18, compiled successfully in 17.2s

---

## 3. Memory Optimization Results

| Action | Memory Freed |
|--------|-------------|
| Killed orphaned Chromium browser (16 processes, ~500MB) | **+185Mi** |
| Cleaned npm cache | Marginal |
| **Total improvement** | **380Mi → 565Mi (+48% increase)** |

### Remaining Memory Hogs
- `next-server` (PID 466685): **678MB** (16.8%) — This is the Next.js production server. It's bundling the dev server. Could be reduced by switching to `bun run publish` (production build), but `next dev` is serving the app now.

---

## 3. Route Health (localhost:3000)

| Route | Status | Size |
|-------|--------|------|
| `/` (Landing) | ✅ HTTP 200 | 90KB |
| `/audit` (Reputation Guard) | ✅ HTTP 200 | 26KB |
| `/signup` | ✅ HTTP 200 | 28KB |
| `/roi-calculator` | ✅ HTTP 200 | 22KB |

**All local routes returning full HTML content.**

---

## 4. Public URL Health

| URL | Status | Size |
|-----|--------|------|
| `https://2a76dac2dcee2a15a0b2f69afa0b21b5.ctonew.app/` | ⚠️ HTTP 200 — **0 bytes body** | Empty |
| `https://.../audit` | ⚠️ HTTP 200 — **0 bytes body** | Empty |

**Issue:** Public URL returns HTTP 200 but empty body. Localhost serves 46KB correctly.  
**Root Cause (Identified):** The public URL does NOT proxy to our local port 3000. Response headers reveal:
- `x-render-origin-server: Render` — Origin server is **Render.com**, not our sandbox
- `server: cloudflare` — Proxied through **Cloudflare CDN**
- `via: 1.1 google` — Also routed through Google Cloud
- `rndr-id: b4d110ab-3826-4ef5` — Render server identifier
- No `Content-Length` header — body is truly empty at the Render origin
- `cf-cache-status: DYNAMIC` — Cloudflare passes through to origin (not cached)

**Impact:** All outreach pointing to the public URL lands on a blank page. The Render deployment is serving an empty body for all routes including `/` and `/audit`.

**What was done:** Switched from `next dev` to production `next start` on port 3000 — app serves 46KB locally. Public URL is a separate Render deployment that we cannot modify from this sandbox (no Render credentials, no render.yaml, no deploy scripts in repo).

**Needed to fix:** Render.com credentials to redeploy the app, or reconfigure the ctonew.app proxy to point to our sandbox port 3000 instead of Render.

---

## 5. Database (team-db)

| Status | Detail |
|--------|--------|
| **Permission fix** | ✅ Applied — `chown :team` + `chmod g+rw` on all `.data/` files |
| **Turso sync** | ⚠️ Intermittent `GenericFailure` — WAL checkpoint issue at watermark 1330 (server-side Turso issue, not local) |

**Note:** Two files (`db-info`, `db-wal-revert`) were owned by `agent-growth-hacker:agent-growth-hacker` instead of `:team`. Fixed by changing group ownership to `team` and setting `g+rw`.

---

## 6. Email Engine (sales_send.js)

**Status:** ✅ Already hardened

| Feature | Status |
|---------|--------|
| API key from env | ✅ (with `.env` fallback) |
| 15-second timeout | ✅ (AbortController) |
| Rate-limit detection (429) | ✅ |
| Domain restriction (403) | ✅ |
| Server error (5xx) | ✅ |
| Timeout handling | ✅ |
| Dry-run mode (`--dry-run`) | ✅ |
| CLI usage documentation | ✅ |

**No changes needed** — the email engine is properly hardened with timeout, error categorization, and safe API key handling.

---

## 7. PWA Status

| Feature | Status |
|---------|--------|
| Manifest (`/manifest.json`) | ✅ Loaded in HTML |
| Apple touch icon | ✅ |
| Service worker | Not visible in dev mode — production build needed |

---

## 8. Recommendations

1. **Public URL fix:** Try building for production with `bun run publish` from `/home/team/shared/site` (TanStack Start default) or stop the current next dev server and use `npm run build && npm run start` with Next.js production mode — production builds typically handle proxied requests better.

2. **Memory:** Keep monitoring. The `next-server` at 678MB is the single largest consumer. If memory gets tight again, switch to production mode which has a smaller memory footprint.

3. **team-db:** The Turso WAL checkpoint error is server-side. If it recurs, a full re-sync (deleting `.data/` files) resolves it temporarily.

4. **Daemon monitoring:** `monitor-services.js` (44MB) and the outreach daemon are running — ensure they don't accumulate over time.