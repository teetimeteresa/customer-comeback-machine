# 🔧 Technical Coordination — Happiness Pulse & Milestone Tracking

**For:** Operations & Architect  
**From:** Customer Success Engineer & Concierge  
**Priority:** High — needed before the outreach sprint

---

## 1. 30-Day Happiness Pulse Email — Technical Requirements

### What We Need

An automated check-in email sent to every business owner 30 days after their subscription starts.

### Database Changes

```sql
-- Add tracking fields to subscriptions table
ALTER TABLE subscriptions ADD COLUMN happiness_pulse_sent INTEGER DEFAULT 0;
ALTER TABLE subscriptions ADD COLUMN happiness_pulse_date TEXT;
```

### Cron Job / API Endpoint

We need a new endpoint (or an addition to the existing email cron):

```
GET /api/email/happiness-pulse?key={CRON_API_KEY}
```

**Logic:**
1. Query all subscriptions where:
   - `status = 'active'`
   - `happiness_pulse_sent = 0`
   - `current_period_start` is 30+ days ago
2. For each match:
   - Count customers for that business: `SELECT COUNT(*) FROM customers WHERE business_id = X`
   - Load the Happiness Pulse email template from `/home/team/shared/HAPPINESS_IMPLEMENTATION/01_30_DAY_HAPPINESS_PULSE.md`
   - Personalize: {Owner Name}, {Business Name}, {X} = customer count, {Your Name} = CSM name
   - Send email using existing `sendEmail()` function
   - Log in `emails` table with `type = 'happiness_pulse'`
   - Update `happiness_pulse_sent = 1`, `happiness_pulse_date = NOW()`
3. Return summary: `{ processed: N, sent: M }`

### Schedule

Run once daily at 9:00 AM local time (set up via Vercel Cron Jobs or external cron service).

---

## 2. 50-Customer Milestone Detection

### What We Need

An alert when any business hits 50+ customers in their `customers` table.

### Approach

Add a check to the existing email processing cron (runs periodically):

```sql
-- Check for businesses that crossed the 50-customer milestone
SELECT b.id, b.name, b.owner_id, COUNT(c.id) as customer_count
FROM businesses b
JOIN customers c ON c.business_id = b.id
WHERE b.milestone_50_sent = 0  -- new column needed
GROUP BY b.id
HAVING customer_count >= 50
```

### Database Changes Needed

```sql
ALTER TABLE businesses ADD COLUMN milestone_50_sent INTEGER DEFAULT 0;
ALTER TABLE businesses ADD COLUMN milestone_50_date TEXT;
```

### Notification

When detected, send an internal notification (email to Customer Success team or add to a dashboard view):

```
ALERT: {Business Name} just hit 50 customers!
Action: Send physical congratulations card within 48 hours.
```

---

## 3. Positive Customer Count for Pulse Email

The Happiness Pulse email references "you've already re-connected with {X} neighbors." We need:

```sql
-- Query to calculate this
SELECT COUNT(*) as total_customers,
  SUM(CASE WHEN created_at > datetime('now', '-30 days') THEN 1 ELSE 0 END) as new_this_month
FROM customers
WHERE business_id = ?
```

---

## 4. Priority & Dependencies

| Item | Depends On | Estimated Effort | Who |
|------|-----------|-----------------|-----|
| 30-Day Pulse endpoint | Existing email cron | 2-4 hours | Operations/Architect |
| DB schema changes | Database access | 30 min | Operations |
| Milestone detection | Existing cron | 2 hours | Operations/Architect |
| Physical card process | Manual (no code) | 1 hour setup | Customer Success |

---

## 5. Implementation Order

1. **Add columns** to `subscriptions` and `businesses` tables
2. **Build happiness-pulse endpoint** (reuse existing email infrastructure)
3. **Add milestone detection** to existing cron logic
4. **Test** with a test subscription that's backdated to 30 days ago
5. **Launch** — runs automatically after deployment

---

## Current Infrastructure Reference

Existing email processing is at:
- `/home/team/shared/src/api/email/send/route.ts` — GET handler for cron
- `/home/team/shared/src/lib/email.ts` — `sendEmail()` function
- `/home/team/shared/src/lib/db.ts` — database helpers

The existing cron endpoint already processes scheduled emails. We can add the Happiness Pulse logic as a new case within this same endpoint.