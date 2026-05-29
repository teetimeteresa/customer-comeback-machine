# 🚀 LAUNCH READY — Customer Comeback Machine
## What Was Done + What You Need To Do Right Now

---

## ✅ DONE — Already Completed

### 1. Subscription Plans Seeded
```
• Starter Plan     — $49/month     (price_1TZbfDRChQpSKxdxsv74zbW7)
• Growth Plan      — $99/month     (price_1TZbjORChQpSKxdxoQhywOuM)  
• Pro Plan         — $199/month    (price_1TZblGRChQpSKxdxGUaYbDEg)
• Done-for-You     — $497 one-time (price_1TZbnZRChQpSKxdx4pUpTqTZ)
```
All 4 plans are in the `subscription_plans` table, ready for Stripe checkout.

---

### 2. Resend Domain Added Programmatically
The domain `customercomebackmachine.com` has been added to the Resend account via API.
It is currently in "not_started" status and needs DNS verification.

---

## 🛡️ YOUR 3 ACTIONS TO GO LIVE (15 Minutes)

### ⚡ ACTION 1: Resend — Add These DNS Records (5 minutes)

Go to your domain registrar (where you bought customercomebackmachine.com) and add:

```
RECORD 1 — DKIM (TXT record):
  Name:    resend._domainkey
  Value:   p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDUB7kWWTCzKfD8RRLcJSt3y4gGeABpfvKPBbsfa8DVnXQRHOdeovjwhT6IzynSzv558xcONkUjfoQn1eVKataJjp1zLwQV3AQkK7WdU9EpMvhsheFjLj8UUIwTCymV8X0M8xA9mr3TXp9wDd1vJ0LiwC0/g2gMq4K7WALmQwpR1QIDAQAB
  Type:    TXT

RECORD 2 — MX (for SPF):
  Name:    send
  Value:   feedback-smtp.us-east-1.amazonses.com
  Type:    MX
  Priority: 10

RECORD 3 — SPF (TXT record):
  Name:    send
  Value:   v=spf1 include:amazonses.com ~all
  Type:    TXT
```

After adding, wait 5–30 minutes for Resend to auto-detect and verify.

**Then update your `.env` file:**
```
EMAIL_FROM=Customer Comeback Machine <noreply@customercomebackmachine.com>
```

**Restart the app:**
```bash
cd /home/team/shared && npm run build && npm run dev
```

---

### ⚡ ACTION 2: Stripe — Get Live Keys (5 minutes)

1. Go to https://dashboard.stripe.com
2. Click **Developers** → **API Keys**
3. Toggle to **"Live mode"** (top right)
4. Copy the **Secret key** (`sk_live_...`) → paste into `.env` as `STRIPE_SECRET_KEY`
5. Copy the **Publishable key** (`pk_live_...`) → paste into `.env` as `STRIPE_PUBLISHABLE_KEY`

---

### ⚡ ACTION 3: Stripe — Set Up Webhook (5 minutes)

1. Go to https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. Enter endpoint URL:
   ```
   https://customercomebackmachine.com/api/stripe/webhook
   ```
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (`whsec_...`) → paste into `.env` as `STRIPE_WEBHOOK_SECRET`

---

## ⚠️ Important Notes

**On Resend domain verification:**
- The domain was added via API but cannot be verified automatically — you must add the 3 DNS records at your registrar
- Once added and verified, email sending goes from TEST mode → LIVE mode
- All 866 leads in the database will be able to receive real emails

**On Stripe:**
- Test mode keys are currently in `.env` — real payments won't process until replaced with live keys
- The webhook secret is a placeholder — without the real value, subscription status updates won't be recorded

**On going live:**
- Once Actions 1–3 are done, restart the app and test the full signup flow
- The app will be ready to take real payments and send real emails

---

## 📁 Files Modified This Session
- `/home/team/shared/scripts/setup-production.js` — Production setup script (creates table, adds domain, provides instructions)
- `/home/team/shared/LAUNCH_READY.md` — This document
