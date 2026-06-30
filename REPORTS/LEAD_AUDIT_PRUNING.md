# Lead Table Audit & Pruning Research

## Overview
Audit of the central Turso `leads` table for potential pruning targets.

## 1. Total Volume
| Metric | Count |
|--------|-------|
| **Total Leads** | ~168,000 |
| Target US Cities | 35,270 |
| Other US Cities | 91,231 |
| International | 41,875 |

## 2. Scratch / Test Records (SAFE TO DELETE)

| Type | Count | Detail |
|------|-------|--------|
| **NULL business_name** | 3,437 | Records with no business name and no city. Likely import artifacts from early testing. Contains entries like `info@indigoandcotton.com`, `hello@pinkdotbeautybar.com` — these are real-looking emails but with no business context. |
| **Explicit test entries** | ~10 | "Internal Test 1/2/3", "Test", "Test Dental Office", "Test Optical Chicago/LA/NYC" |

**Recommendation:** The 3,437 NULL-name records are safe to delete. They provide no targeting value and may cause confusion.

## 3. Duplicate Emails

| Severity | Count | Example |
|----------|-------|---------|
| 12 dupes | 2 emails | `contact@golden-bean-bakery.com.au`, `hello@radiantstudio-austin.com` |
| 11 dupes | 5 emails | `.com.au` pattern + some US |
| 10 dupes | 3 emails | Various |
| 2-9 dupes | Hundreds | Typical expansion blitz duplicates |

**Pattern:** Most duplicates come from the expansion blitz where the same generated email was assigned to multiple "branches" of the same business (e.g., "Austin Pet Resort 1", "Austin Pet Resort 2").

**Recommendation:** Deduplicate by keeping the first occurrence (lowest ID) per email.

## 4. International Data

| City | Count | Notes |
|------|-------|-------|
| Sydney | 5,206 | Expansion blitz data (`.com.au` emails) |
| London | 5,126 | Expansion blitz |
| Tokyo | 5,122 | Expansion blitz |
| Toronto | 5,095 | Expansion blitz |
| Melbourne | 5,000 | Expansion blitz |
| Other Intl | ~16,000 | Manchester, Osaka, Vancouver, Montreal, etc. |

**Total International:** 41,875 leads — these are outside our service area (US-only local businesses).

**Recommendation:** These are valid generated leads but outside our target market. Consider whether to keep them for future international expansion or prune.

## 5. Placeholder / Unverified Emails

| Type | Count |
|------|-------|
| `@leads.ccm` pattern | 24 (Wave 2 surgical leads awaiting research) |
| Pending verification | 229 (HLTV Med Spa) + 200 (Vet Wave 1) |

**Recommendation:** Keep all — these are intentional placeholders for leads in progress.

## 6. ID Prefix Breakdown

| Prefix | Count | Source |
|--------|-------|--------|
| `blitz-*` | 13,000 | Niche expansion blitz |
| `expansion-*` | 690 | Geo expansion (690 ingested) |
| `hltv-ms-*` | 229 | High-LTV Med Spa (our work) |
| `vet-wave1-*` | 200 | Veterinary Wave 1 (our work) |
| `sw-*` | 24 | Wave 2 surgical leads |
| `csv-*` | ~1,000+ | CSV imports from Austin vault |
| `medspa-*` | 0 | Generated but used hltv-ms prefix |
| Other (UUID) | 154,233 | Original database + expansion blitz |

## 7. Pruning Recommendations

### Immediate (Safe to Delete)
1. **3,437 NULL business_name records** — no targeting value, likely test artifacts
2. **~10 explicit test records** — "Internal Test", "Test Dental Office", etc.

### Consider for Pruning
3. **Duplicate emails** — remove duplicates keeping lowest ID (~hundreds of records)
4. **International leads** (41,875) — keep if planning international expansion, otherwise prune

### Keep As-Is
5. **Placeholder emails** — intentional, leads in progress
6. **All hltv-ms, vet-wave1, sw records** — our curated leads