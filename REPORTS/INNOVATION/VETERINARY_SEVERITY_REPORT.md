# Veterinary Severity Report — High-Severity Targets

## Summary
Analyzed **1,000 Veterinary Clinic leads** from the central database and identified the **Top 50 high-severity targets** based on severity scoring algorithm.

## Scoring Methodology
| Factor | Points | Rationale |
|--------|--------|-----------|
| Base Score | 50 | All leads start at moderate baseline |
| Unique Name (not generic) | +10 | Independent clinics have higher need |
| Target City (Denver) | +10 | Denver is in our strike zone |
| Personal Email (gmail/yahoo) | +15 | Small/independent business signal |
| Chain Name (VCA, Banfield, etc.) | -30 | Lower priority for chains |

## Results
- **50 SEVERE leads** (score: 70/100) identified — all in Denver
- The leads in Seattle (346) and Portland (332) scored lower (60/100) due to being outside target cities
- No vet leads exist in Austin, Charlotte, Nashville, or Scottsdale

## City Distribution
| City | Total Leads | High-Severity (Top 50) |
|------|-------------|----------------------|
| Seattle | 346 | 0 |
| Portland | 332 | 0 |
| Denver | 322 | 50 |

## Top 5 Priority Targets
1. **Compassionate Animal Clinic** — Denver — 70/100
2. **Happy Pet Clinic** — Denver — 70/100
3. **Noble Pet Clinic** — Denver — 70/100
4. **Healthy Pet Clinic** — Denver — 70/100
5. **Happy Vet** — Denver — 70/100

## Recommendation
These leads are all from the expansion blitz with algorithmically generated names. For real vet clinic outreach, consider:
1. Generating fresh vet clinic leads via Google Maps for our target cities
2. Or expanding Denver as a new target city for veterinary outreach
3. The Sales Closer should verify domains/emails before initiating the Warm Hug sequence

## File
`veterinary_severity_report.csv` — Full top 50 report with IDs, names, cities, emails, and priority tiers