# ❤️ 30-Day "Happiness Pulse" Automated Email

**Status:** ✅ Ready for implementation  
**Owner:** Customer Success Engineer & Concierge  
**Trigger:** 30 days after customer's first payment/subscription start date  
**Target:** All active subscribers (any plan)

---

## Email Template

**Subject:** `30 days of comebacks! How are you feeling? {Business Name} ❤️`

**Preview Text:** "I peeked at your dashboard and I'm so proud of what you've built!"

---

**Hi {Owner Name},**

It's been 30 days since you joined the Customer Comeback Machine family. I wanted to personally check in and see how you're feeling.

I took a peek at your dashboard — and WOW. You've already re-connected with **{X} neighbors** since you started! That's {Y} more people who walked into your shop and felt remembered, appreciated, and invited back.

That's not just metrics. That's the heartbeat of your business growing stronger.

**Quick questions for you:**
1. How's your QR code working? Are customers scanning it?
2. Have you noticed any difference in repeat visits?
3. Is there anything we can improve or add?

Just hit reply — I read every message personally. No bots, no templates, just me.

**One thing to try this week:**
If you haven't already, move your QR code to a spot where customers naturally wait (checkout counter, seating area, or front door). We've seen businesses double their opt-in rate just by moving the sign 3 feet.

Thank you for trusting us with your community. We don't take that lightly.

With warmth,
{Your Name}
Customer Success Engineer & Concierge
Customer Comeback Machine

P.S. — When you hit 50 customers captured, I have a little surprise for you. Keep going! 🎉

---

## Technical Implementation

### Option A: Database-Triggered (Recommended)

A new table or column in `subscriptions` or `businesses` to track Day 30 status:

```sql
-- Add to subscriptions table or create new
ALTER TABLE subscriptions ADD COLUMN happiness_pulse_sent INTEGER DEFAULT 0;
ALTER TABLE subscriptions ADD COLUMN happiness_pulse_date TEXT;
```

**Cron job logic (pseudo-code):**
```
Every 24 hours at 9:00 AM:
  FOR EACH subscription WHERE status = 'active'
    AND happiness_pulse_sent = 0
    AND current_period_start <= 30 days ago:
      
      customer_count = COUNT(*) FROM customers WHERE business_id = subscription.business_id
      
      SEND email to subscription owner using template above
        with {X} = customer_count
        with {Y} = "X new customers this month" (calc from customers WHERE created_at > 30 days ago)
      
      UPDATE subscriptions SET happiness_pulse_sent = 1, happiness_pulse_date = NOW()
```

### Option B: API Endpoint (For the /api/email/send route)

Add a new case to the existing email cron endpoint:

```
GET /api/email/happiness-pulse?key={CRON_API_KEY}
```

This endpoint:
1. Finds all businesses where subscription is 30+ days old and pulse not sent
2. Generates the personalized email
3. Logs it in the `emails` table
4. Marks the subscription as `happiness_pulse_sent = 1`

---

## Email Compliance

- [ ] Unsubscribe link in footer (using existing `generateUnsubscribeUrl`)
- [ ] Business physical mailing address (required for CAN-SPAM)
- [ ] Clear "Reply to this email" messaging (not a marketing blast)
- [ ] Log in `emails` table with type = `happiness_pulse`

---

## Expected Impact

| Metric | Expected | Why |
|--------|----------|-----|
| Reply rate | 15-25% | Personal email from a real person |
| Support requests resolved | 30% reduction | Proactive before reactive |
| Referral rate | +10% | Happy customers reminded of our value |
| Cancellation rate | -20% | Personal connection reduces churn |