# 🔧 Internal Setup Checklist — Done-for-You ($497)

**Total Time:** ~4.5 hours | **SLA:** Deliver within 48 hours of receiving completed onboarding form

---

## Phase 1: Client Returns Onboarding Form (Day 1, Hour 0)

- [ ] Send client the setup form/questions
- [ ] Request if missing: logo (high-res PNG), mailing address (CAN-SPAM compliance), brand colors, special offer, Google Business Profile name
- [ ] Set expectation: "Your system will be live within 48 hours."
- [ ] Acknowledge receipt within 2 hours (automated + personal note)

## Phase 2: Profile Setup (Day 1, Hour 1 — 30 min)

- [ ] Log in to admin dashboard
- [ ] Update `businesses` table with all client info:
  - [ ] Business name, type, website, city, state
  - [ ] Phone, email, mailing address
  - [ ] Google review link, Facebook, Instagram
  - [ ] Products/services, ideal customer, brand tone
  - [ ] Special thing, current offer
  - [ ] Words liked/disliked for email tone
- [ ] Upload logo to `/public/logos/{slug}.png`
- [ ] Set brand color scheme
- [ ] Save and verify: Visit `/optin/{slug}` — looks professional

## Phase 3: Google Review Link (Day 1, Hour 1.5 — 15 min)

- [ ] Find Google Business Profile (search maps)
- [ ] Generate review link using Place ID finder
- [ ] Test the link works
- [ ] Save in business profile
- [ ] Verify Review Request email links to it

## Phase 4: QR Code Sign Design (Day 1, Hour 2 — 45 min)

- [ ] Generate QR code pointing to `/optin/{slug}`
- [ ] Scan it yourself to confirm it works
- [ ] Design tent card (5x7 landscape) with logo + CTA
- [ ] Design sticker (3x3 square) for windows/bags
- [ ] Export as print-ready PDF
- [ ] Upload to dashboard so client can download

## Phase 5: Custom Email Copy (Day 1, Hour 3-5 — 2 hours)

For EACH email, write warm, human copy:

**Email 1 — Thank You (Day 0)**
Subject: `{Business} loves having you!` | Warm and grateful | CTA: "We can't wait to see you again"

**Email 2 — Review Request (Day 2)**
Subject: `Could you do us a quick favor?` | Appreciative | Direct link to Google review | CTA: "Share your experience"

**Email 3 — Comeback Offer (Day 7)**
Subject: `A little something for next time` | Generous | Exclusive offer with urgency | CTA: "Claim your offer"

**Email 4 — Referral Request (Day 21)**
Subject: `Know someone who would love us?` | Friendly, community | Referral reward explained | CTA: "Share the love"

**Email 5 — Win-Back (Day 45)**
Subject: `We miss your face!` | Warm, honest | What's new + welcome back offer | CTA: "Come see what's new"

**Rules:** Unsubscribe link in every email. Business address in footer. Consistent brand tone. 80-150 words. No "Dear customer." No robotic phrases.

- [ ] Save all 5 email copies with subject lines + body HTML
- [ ] Set scheduling triggers (Day 0, 2, 7, 21, 45)

## Phase 6: Campaign Activation (Day 2 — 30 min)

- [ ] Create campaign records:
  - [ ] "Welcome Sequence" — active
  - [ ] "Birthday Club" — active (if opted in)
  - [ ] "Monthly Campaign" — active (if Growth+)
- [ ] Toggle settings: birthday_club, review, comeback, referral
- [ ] Verify cron job will pick up this business
- [ ] TEST: Create test customer opt-in → confirm Email 1 arrives within 5 min

## Phase 7: Walkthrough Video (Day 2 — 30 min)

Record 15-min Loom:
1. "Welcome! Here's your system."
2. Walk through dashboard metrics
3. Show QR code download/print
4. Show customer list (even if empty)
5. Show active campaigns
6. Show settings
7. "Here's what customers experience" — mock opt-in
8. "I'll check in 7 days. Reply anytime."

## Phase 8: Delivery (Day 2 — 15 min)

Send "Your System is Live!" email with:
- [ ] Live opt-in page URL
- [ ] QR code sign PDF download link
- [ ] Dashboard login link
- [ ] Walkthrough video link
- [ ] Email sequence preview (all 5 emails)
- [ ] Next steps: "Put QR code on your counter today!"
- [ ] "I'll call you in 7 days"
- [ ] Log in outreach_log
- [ ] Schedule 7-day check-in reminder

## Phase 9: 7-Day Check-in (Day 9)

- [ ] Call or video message
- [ ] Review: customers opted in? Questions? QR code being used?
- [ ] Optimize: tweak offers if low conversion
- [ ] Ask for testimonial if happy
- [ ] Log notes in outreach_log

**Total: 48 checklist items** — All must be checked before marking account "Live"