# Google Ads "Brand Hijack" — Launch Package

This document contains the finalized campaign structures, ad copy, and tracking instructions for the Google Ads Brand Hijack campaign, as outlined in the Growth Hacker's blueprint.

## 🚀 Campaign Overview
- **Objective:** Drive high-intent traffic to the niche-specific ROI Calculator to capture leads and convert them into Founding Members.
- **Total Daily Budget:** $85.00
- **Target Locations:** Austin, Charlotte, Toronto, London, NYC
- **Language:** English

---

## 🏗️ Campaign Structures

### 1. Campaign: Med Spa Retention
- **Daily Budget:** $25.00
- **Keywords (Phrase/Exact):**
  - "botox patient retention"
  - "med spa customer churn"
  - [reduce no show rate spa]
  - "aesthetic clinic patient recall"
  - [med spa follow up system]
  - "botox appointment reminder service"
  - [patient re-engagement for med spa]
- **Landing Page:** `http://localhost:3000/roi-calculator?niche=medspa`
- **Ad Copy:**
  - **Headline 1:** Stop Losing Botox Patients 🩸
  - **Headline 2:** Automate Your Refresh Reminders
  - **Headline 3:** $49/mo — No Setup Fee
  - **Description 1:** You're paying $300 to acquire a patient, then losing them after 90 days. CCM automates treatment-cycle reminders so they come back before the competition steals them.
  - **Description 2:** Limited to 10 Founding Members per city. Get lifetime $49/mo rate + $497 setup waived.

### 2. Campaign: Dental Practice Retention
- **Daily Budget:** $25.00
- **Keywords (Phrase/Exact):**
  - "dental patient recall system"
  - "hygiene patient rebooking"
  - [dental no show follow up]
  - "patient retention for dentists"
  - [dental practice churn rate]
  - "invisalign patient follow up"
- **Landing Page:** `http://localhost:3000/roi-calculator?niche=dental`
- **Ad Copy:**
  - **Headline 1:** Fill Your Hygiene Slots 🦷
  - **Headline 2:** Stop Chasing Patients Manually
  - **Headline 3:** $49/mo Founding Member Deal
  - **Description 1:** Your front desk is for greeting patients, not begging them to come back. CCM automates the 6-month recall loop so your chairs stay full and your team stays focused.
  - **Description 2:** Limited to 10 Founding Members per city. $497 setup waived.

### 3. Campaign: Salon & Barber Retention
- **Daily Budget:** $20.00
- **Keywords (Phrase/Exact):**
  - "salon client rebooking system"
  - [hair salon no show solution]
  - "salon customer retention software"
  - "automated appointment reminders salon"
  - [barber shop loyalty program app]
- **Landing Page:** `http://localhost:3000/roi-calculator?niche=salon`
- **Ad Copy:**
  - **Headline 1:** Stop the 6-Week Drift ✂️
  - **Headline 2:** Auto-Rebook Your Regulars
  - **Headline 3:** $49/mo — No Setup Fee
  - **Description 1:** Your clients love your work, but life gets in the way. CCM automates the re-booking reminder so they stay in YOUR chair, not the one down the street.
  - **Description 2:** Takes 2 minutes to set up. No contracts. Cancel anytime.

### 4. Campaign: Small Business Retention (General)
- **Daily Budget:** $15.00
- **Keywords (Phrase/Exact):**
  - "small business customer retention"
  - "local business loyalty program"
  - [QR code loyalty program]
  - "automated customer follow up"
  - "reduce customer churn small business"
  - [repeat customer automation]
- **Landing Page:** `http://localhost:3000/roi-calculator?niche=retail`
- **Ad Copy:**
  - **Headline 1:** Stop the Leaky Bucket 🪣
  - **Headline 2:** Automate Your Customer Retention
  - **Headline 3:** $49/mo — 2 Min Setup
  - **Description 1:** Turn one-time visitors into repeat customers. CCM automates follow-ups, review requests, and loyalty campaigns triggered by a simple QR scan.
  - **Description 2:** Free 14-day trial. Founding Member rate locks in $49/mo forever.

---

## 🛠️ Conversion Tracking
1. **Primary Conversion:** User completion of the `/signup` form.
2. **Secondary Conversion:** User calculation of ROI on `/roi-calculator`.

**Instruction for Infrastructure/Designer:**
Ensure the following script is placed in the head of all pages:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 📅 Estimated Launch Date: June 15, 2026
*Note: Pending owner verification of Google Ads account and final creative assets from Designer.*
