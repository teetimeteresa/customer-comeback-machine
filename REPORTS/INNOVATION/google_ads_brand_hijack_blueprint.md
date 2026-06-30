# Google Ads "Brand Hijack" Campaign — Execution Blueprint

**Part of Innovation Brief #001 — Channel 6**
**Date:** June 11, 2026
**Author:** Growth Hacker
**Status:** 🔴 NOT STARTED — Ready for Marketer to implement

---

## Why This Channel

Local business owners Google their problems. When a Med Spa owner searches "how to reduce botox patient churn," they are actively looking for a solution. CCM is the answer.

We're NOT bidding on generic "customer retention software" ($50+/click). We're bidding on **niche-specific pain point keywords** that are:
- Low competition (local business terms, not SaaS terms)
- High intent (they know they have a problem)
- Cheap ($1-5/click vs $20-50 for generic SaaS terms)

---

## Campaign Structure

### 1. Campaign: "Med Spa Retention"
- **Daily Budget:** $25
- **Locations:** Austin, Charlotte, Toronto, London, NYC
- **Networks:** Search only (no Display/YouTube)

#### Ad Group A — Churn Keywords
| Keyword | Match Type | Est. CPC |
|---------|-----------|---------|
| botox patient retention | phrase | $3.50 |
| med spa customer churn | phrase | $2.80 |
| reduce no show rate spa | exact | $4.20 |
| aesthetic clinic patient recall | phrase | $3.10 |
| med spa follow up system | exact | $2.90 |
| botox appointment reminder service | phrase | $4.50 |
| patient re-engagement for med spa | exact | $3.80 |

#### Ad Group B — Competitor Pain Keywords
| Keyword | Match Type | Est. CPC | Intent |
|---------|-----------|---------|--------|
| patients not coming back to med spa | phrase | $3.20 | 🔥 High |
| losing botox patients to competitor | exact | $5.00 | 🔥 High |
| med spa customer retention software | phrase | $4.80 | 🔥 High |
| automated follow up for med spas | exact | $3.60 | 🔥 High |

#### Ad Copy — Med Spa

**Headline 1:** Stop Losing Botox Patients 🩸
**Headline 2:** Automate Your Refresh Reminders
**Headline 3:** $49/mo — No Setup Fee
**Description 1:** You're paying $300 to acquire a patient, then losing them after 90 days. CCM automates treatment-cycle reminders so they come back before the competition steals them.
**Description 2:** Limited to 10 Founding Members per city. Get lifetime $49/mo rate + $497 setup waived.

---

### 2. Campaign: "Dental Practice Retention"
- **Daily Budget:** $25
- **Locations:** Austin, Charlotte, Toronto, London, NYC
- **Networks:** Search only

#### Ad Group A — Recall Keywords
| Keyword | Match Type | Est. CPC |
|---------|-----------|---------|
| dental patient recall system | phrase | $4.50 |
| hygiene patient rebooking | phrase | $3.20 |
| dental no show follow up | exact | $3.80 |
| patient retention for dentists | phrase | $5.00 |
| dental practice churn rate | exact | $3.50 |
| invisalign patient follow up | phrase | $4.20 |

#### Ad Group B — Pain Keywords
| Keyword | Match Type | Est. CPC | Intent |
|---------|-----------|---------|--------|
| patients skipping 6 month recall | phrase | $4.00 | 🔥 High |
| empty hygiene slots solution | exact | $3.60 | 🔥 High |
| dental patient re-engagement | phrase | $4.50 | 🔥 High |
| how to fill dental cancellations | phrase | $3.30 | 🔥 High |

#### Ad Copy — Dental

**Headline 1:** Fill Your Hygiene Slots 🦷
**Headline 2:** Stop Chasing Patients Manually
**Headline 3:** $49/mo Founding Member Deal
**Description 1:** Your front desk is for greeting patients, not begging them to come back. CCM automates the 6-month recall loop so your chairs stay full and your team stays focused.
**Description 2:** Limited to 10 Founding Members per city. $497 setup waived.

---

### 3. Campaign: "Salon & Barber Retention"
- **Daily Budget:** $20
- **Locations:** Austin, Charlotte, Toronto, London, NYC

#### Ad Group A — Rebooking Keywords
| Keyword | Match Type | Est. CPC |
|---------|-----------|---------|
| salon client rebooking system | phrase | $2.50 |
| hair salon no show solution | exact | $3.00 |
| salon customer retention software | phrase | $3.80 |
| automated appointment reminders salon | phrase | $2.80 |
| barber shop loyalty program app | exact | $2.20 |

#### Ad Copy — Salon

**Headline 1:** Stop the 6-Week Drift ✂️
**Headline 2:** Auto-Rebook Your Regulars
**Headline 3:** $49/mo — No Setup Fee
**Description 1:** Your clients love your work, but life gets in the way. CCM automates the re-booking reminder so they stay in YOUR chair, not the one down the street.
**Description 2:** Takes 2 minutes to set up. No contracts. Cancel anytime.

---

### 4. Campaign: "Small Business Retention (General)"
- **Daily Budget:** $15
- **Locations:** Austin, Charlotte, Toronto, London, NYC

#### Ad Group — General SMB Keywords
| Keyword | Match Type | Est. CPC |
|---------|-----------|---------|
| small business customer retention | phrase | $6.50 |
| local business loyalty program | phrase | $4.00 |
| QR code loyalty program | exact | $3.50 |
| automated customer follow up | phrase | $5.00 |
| reduce customer churn small business | phrase | $5.50 |
| repeat customer automation | exact | $4.20 |

#### Ad Copy — General

**Headline 1:** Stop the Leaky Bucket 🪣
**Headline 2:** Automate Your Customer Retention
**Headline 3:** $49/mo — 2 Min Setup
**Description 1:** Turn one-time visitors into repeat customers. CCM automates follow-ups, review requests, and loyalty campaigns triggered by a simple QR scan. No tech skills needed.
**Description 2:** Free 14-day trial. Founding Member rate locks in $49/mo forever.

---

## Landing Page Recommendations

Each ad group should point to a **niche-specific landing page** for maximum conversion:

| Campaign | Landing Page | URL |
|----------|-------------|-----|
| Med Spa | Med Spa Landing Page | `/med-spa` (create) |
| Dental | Dental Landing Page | `/dental` (create) |
| Salon | Salon Landing Page | `/salon` (create) |
| General | ROI Calculator | `/roi-calculator` (being deployed) |

**Landing Page Must-Haves:**
- Niche-specific headline (e.g., "Stop Losing Botox Patients")
- ROI Calculator embedded or linked
- Founding Member offer ($49/mo, $497 waived)
- Social proof (testimonials from similar businesses)
- Simple form: Name + Email + Phone
- Trust signals: "No contract. Cancel anytime. 14-day free trial."

---

## Conversion Tracking Setup

### Google Ads Conversion Actions

1. **Sign-up (Primary):** Track when user completes `/signup`
   - Value: $49 (first month MRR)
   - Count: Every

2. **ROI Calculator Use (Secondary):** Track when user calculates their loss
   - Value: $0 (lead gen signal)
   - Count: Every

3. **Phone Call (If applicable):** Track calls from ad landing pages
   - Value: $49
   - Count: Every

### Tag Setup
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
  
  // Conversion tracking for signups
  gtag('event', 'conversion', {
    'send_to': 'AW-XXXXXXXXXX/XXXXXXXXXX',
    'value': 49.0,
    'currency': 'USD'
  });
</script>
```

---

## Budget Breakdown

| Campaign | Daily Budget | Est. Clicks/Day | Est. Cost/Lead | Est. Leads/Month |
|----------|-------------|----------------|---------------|-----------------|
| Med Spa | $25 | 6-8 | $15-20 | 30-40 |
| Dental | $25 | 5-7 | $18-25 | 25-30 |
| Salon | $20 | 7-10 | $10-15 | 40-50 |
| General SMB | $15 | 2-3 | $25-35 | 10-15 |
| **Total** | **$85/day** | **20-28** | **~$18 avg** | **105-135** |

**Monthly ad spend:** ~$2,550
**Expected signups at 5% conversion:** 5-7 new accounts/month
**MRR from ads:** $245-$343/mo (Starter plan)
**Break-even:** Month 8-10 per customer
**By month 6 (compounding):** 30-42 accounts = $1,470-$2,058 MRR from ads alone

---

## Implementation Checklist

### Week 1 — Setup (Marketer)
- [ ] Create Google Ads account (or use existing)
- [ ] Set up conversion tracking via GTM
- [ ] Create 4 campaigns with above structure
- [ ] Add keyword lists (exact/phrase match only)
- [ ] Write 4 ad variations per ad group (A/B test)
- [ ] Set location targeting to priority cities
- [ ] Set schedule: Mon-Fri 8am-6pm local time
- [ ] Add negative keywords: jobs, careers, free, how to

### Week 2 — Launch & Optimize
- [ ] Launch all campaigns at $20/day each
- [ ] Monitor search term reports daily
- [ ] Add negative keywords from search terms
- [ ] Pause low-performing ad copy
- [ ] Double down on high-performing keywords

### Week 3 — Scale
- [ ] Increase budget on winning campaigns
- [ ] Add new cities based on performance
- [ ] Add Display/Remarketing campaigns
- [ ] Create lookalike audiences from converter list

---

## Quick Start (Marketer)

To launch this TODAY:
1. Copy the ad copy from this document
2. Create campaigns in Google Ads (or existing account)
3. Point ads to `/roi-calculator` (being deployed by Infrastructure)
4. Set daily budget to $85 total
5. Start with **Med Spa** campaign first — highest LTV niche
6. Monitor and iterate

---

## Risk Mitigation

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| High CPCs in competitive niches | Medium | Use exact match + long-tail keywords |
| Low conversion rate on landing page | Medium | A/B test landing pages, use niche-specific copy |
| Competitors bidding on our brand | Low | Monitor brand terms, add as negative if needed |
| Budget overspend | Low | Set hard daily caps per campaign |

---

*Ready for the Marketer to execute. Estimated setup time: 2-3 hours.*
