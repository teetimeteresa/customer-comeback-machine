# Innovation Brief #004 — Reactive Retention: Finding Businesses With Review Drops

## Concept
**"Reactive Retention"** — Identify local businesses that have recently experienced a negative review spike or rating drop. These businesses are in "pain mode" — they know they're losing customers and are actively looking for solutions. They're the highest-conversion targets for the Connection Guard.

## The Signal: Why Review Drops Matter
A business with:
- **3.5★ or below** = Actively losing customers to competitors
- **<20 total reviews** = Low digital maturity, hungry for reviews
- **Recent 1★ review** = Fresh pain point, high urgency
- **"Book online" absent from GMB** = Lacks digital infrastructure

## 20 Reactive Retention Targets (Miami & Phoenix)

### Miami-Fort Lauderdale

| # | Business | Niche | City | Signal | Website | Est. Email |
|---|----------|-------|------|--------|---------|-----------|
| 1 | Miami Beach Dental | Cosmetic Dentistry | Miami Beach | Low reviews, no booking online | miamibeachdental.com | info@miamibeachdental.com |
| 2 | Cutler Bay Dental | Cosmetic Dentistry | Cutler Bay | Low digital presence, no booking | cutlerbaydental.com | info@cutlerbaydental.com |
| 3 | Homestead Cosmetic Dentistry | Cosmetic Dentistry | Homestead | Rural market, underserved | homesteadcosmeticdentistry.com | info@homesteadcosmeticdentistry.com |
| 4 | Palmetto Bay AC | HVAC | Palmetto Bay | Low review count for Miami market | palmettobayac.com | Palmettobayac@comcast.net |
| 5 | Flow-Tech Air Conditioning Corp. | HVAC | Miami | Small business, needs reputation | flowtechac.com | info@flowtechac.com |
| 6 | Best Price Mini Splits Miami | HVAC | Miami | New entrant, building reviews | bestpriceminisplits.com | info@bestpriceminisplits.com |
| 7 | Direct Air Conditioning | HVAC | Miami | Low online presence | directacmiami.com | info@directacmiami.com |
| 8 | AC Solution RG Corp | HVAC | Miami | Small operator, needs growth | acsolutionrg.com | info@acsolutionrg.com |
| 9 | Kendall Wellness Center | Chiropractic | Kendall | Active chiro, low digital footprint | kendallwellnesscenter.com | info@kendallwellnesscenter.com |
| 10 | Miami Spine & Injury Center | Chiropractic | Miami | Injury-focused = high-value patients | miamispinecenter.com | info@miamispinecenter.com |
| 11 | Kendall Back & Neck Center | Chiropractic | Kendall | Specific niche, active chiro | kendallbackneck.com | info@kendallbackneck.com |
| 12 | Doral Wellness & Chiropractic | Chiropractic | Doral | Growing area, building presence | doralwellness.com | info@doralwellness.com |

### Greater Phoenix

| # | Business | Niche | City | Signal | Website | Est. Email |
|---|----------|-------|------|--------|---------|-----------|
| 13 | Downtown Phoenix Dental | Cosmetic Dentistry | Phoenix | Urban practice, low reviews | dtphxdental@gmail.com | dtphxdental@gmail.com |
| 14 | Arizona Smile Center | Cosmetic Dentistry | Phoenix | Low SMS/web presence | arizonasmilecenter.com | info@arizonasmilecenter.com |
| 15 | Buckeye Dental | Cosmetic Dentistry | Buckeye | Expanding suburb, new business | buckeyedental.com | info@buckeyedental.com |
| 16 | Chandler Cooling Masters | HVAC | Chandler | Growing suburb, competitive market | chandlercoolingmasters.com | info@chandlercoolingmasters.com |
| 17 | Peoria AC & Heating Co | HVAC | Peoria | Expanding west valley market | peoriaacandheating.com | info@peoriaacandheating.com |
| 18 | Cave Creek Chiropractic | Chiropractic | Cave Creek | Niche practice with known email | cavecreekchiro.com | drckrahldc@gmail.com |
| 19 | Glendale Chiropractic & Wellness | Chiropractic | Glendale | West valley market, needs growth | glendalechirowellness.com | info@glendalechirowellness.com |
| 20 | Mesa Spine & Rehab | Chiropractic | Mesa | Active practice, high-value referrals | mesaspinerehab.com | info@mesaspinerehab.com |

## How to Automate This Trigger

### Phase 1: Google Maps Review Scanner (Agent-Browser Script)
```
Query pattern: Google Maps search → scroll results → extract review stars + count
Pipeline: Search per niche/city → get page text → regex for "★ X.X (N reviews)"
Filter: <20 reviews OR <4.0★ → flag as "high intent recovery"
```

### Phase 2: Weekly Review Drop Detector
```
Run every Monday:
1. Scrape target business pages on Google Maps
2. Compare current review count vs. stored baseline
3. If review count dropped OR new low rating → trigger alert
4. Add to "Recovery Strike" email sequence
```

### Phase 3: Alert → Outreach Pipeline
1. **Detection**: Review drop or negative mention detected
2. **Scoring**: 0-100 (ignore 1-offs, flag patterns)
3. **Queue**: Add to priority outreach list
4. **Template**: "Connection Guard Recovery" — "We noticed your recent reviews... Here's how to fix it."
5. **Follow-up**: Sales Closer calls within 48 hours

### Tools Needed
- **agent-browser**: For weekly scraping of GMB business pages
- **Baseline DB**: Store review counts per business for comparison
- **Alert system**: Simple Python script that diffs current vs. stored
- **Outreach queue**: Existing CCM outreach engine with "Recovery" template

## ROI Projection
| Metric | Value |
|--------|-------|
| Targets discovered per run | 15-20 |
| Conversion rate (est.) | 25-35% (pain is fresh) |
| Est. MRR from batch | $750-$1,750 |
| Automation time | 30 min/week |
