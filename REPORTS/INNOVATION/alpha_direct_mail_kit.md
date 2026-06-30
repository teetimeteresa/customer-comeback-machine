# Alpha Direct Mail Kit — Top 5 Hurting Businesses

## Concept
A physical "Operational Insurance" Kit mailed to each business. Contains:
1. Custom CCM QR code sign (branded with their business name)
2. Handwritten-style letter
3. "Your Business Scorecard" — one-page showing their rating vs area avg

---

## Top 5 Targets

| # | Business | City | Niche | Rating | Severity |
|---|----------|------|-------|--------|----------|
| 1 | Maid in Miami | Miami | Cleaning | 3.4★ | 100/100 |
| 2 | Dade Auto Repair | Miami | Auto Repair | 3.2★ | 100/100 |
| 3 | Broward Auto Care | Ft. Lauderdale | Auto Repair | 3.4★ | 100/100 |
| 4 | South Lamar Cleaners | Austin | Cleaning | 3.4★ | 100/100 |
| 5 | Ultimate Fade Studio | Miami | Barber | 3.5★ | 90/100 |

---

## Kit Components

### Component A: Custom QR Code Sign
Generate using Google Charts API:
```
https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=https://customercomebackmachine.com/welcome/{business_slug}&choe=UTF-8
```

### Component B: Handwritten-Style Letter

**Template (Cleaning Services):**
```
Hi {Name},

I noticed {Business Name} in {City} has been cleaning homes for a while — 
but your online reviews (3.4★) don't reflect the quality you deliver.

I built a free tool that automatically sends a "How's your home feeling?" 
check-in after every clean. It takes 2 minutes to set up.

I'd love to send you a free sample sign. Reply YES and I'll drop one in the mail.

Warmly,
{Growth Hacker}
Customer Comeback Machine
```

**Template (Auto Repair):**
```
Hi {Name},

I've been following {Business Name} in {City}. You run an honest shop, 
but your 3.2★ rating tells me customers aren't speaking up when things go right.

I built a system that automatically follows up after every repair to catch 
issues before they become 1-star reviews.

Would you be open to a 2-min demo? Reply and I'll send over a link.

Best,
{Growth Hacker}
Customer Comeback Machine
```

### Component C: Business Scorecard
One-page PDF showing:
- Their current Google rating vs. area average for their niche
- Estimated annual revenue lost to churn (from ROI calculator)
- "If you improved to 4.0★, you'd gain ~$XX,XXX in repeat revenue"

---

## Production & Fulfillment

**Option A: Digital-First ($0)**
1. Generate QR code using free Google Charts API
2. Send personalized email with QR code embedded
3. "Your custom sign is ready — print it or reply to get a physical one"

**Option B: Physical ($500 for 50 kits)**
1. Use Printful (print-on-demand) for acrylic sign holders
2. Each kit: $8-12 (sign holder + print + shipping)
3. Include handwritten-style note card
4. Track delivery for follow-up call timing

---

## Kit Generation Script

```bash
# Generate QR codes for Top 5 (runs in 2 seconds)
for biz in "Maid_in_Miami" "Dade_Auto_Repair" "Broward_Auto_Care" "South_Lamar_Cleaners" "Ultimate_Fade_Studio"; do
  curl -s "https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=https://customercomebackmachine.com/welcome/${biz}&choe=UTF-8" \
    -o "/home/team/shared/REPORTS/INNOVATION/qr_alpha_${biz}.png"
  echo "✅ QR generated: ${biz}"
done
```

## Follow-up Sequence

| Day | Action |
|-----|--------|
| 0 | Send digital QR preview email |
| 3 | Physical kit arrives (or follow-up email if digital) |
| 5 | Sales Closer DMs: "Did our sign arrive?" |
| 7 | "I'd love to walk you through how it works — 2 minutes" |
| 14 | If no response: "No worries! The link is always live" |

---

## Expected Conversion
- 10-15% response rate on digital QR email
- 15-20% conversion from Sales Closer follow-up
- ~1-2 accounts from Top 5 alpha = $49-98 MRR
- Break-even at 1 account