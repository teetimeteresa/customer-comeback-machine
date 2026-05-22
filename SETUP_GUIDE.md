# Setup Guide: Customer Comeback Machine

Welcome to your new SaaS! Follow these steps to get your business live and generating revenue.

## 1. Required Accounts
You will need the following accounts to run the full system:
- **GitHub**: To host your code.
- **Vercel**: To host the website (Connects to GitHub).
- **Turso**: For your database.
- **Stripe**: To collect payments.
- **Resend**: To send automated emails.
- **OpenAI**: To power the AI follow-up generator.
- **Twilio** (Optional): If you want to enable SMS features in the Pro plan.

## 2. API Keys & Environment Variables
Copy these from your accounts and add them to your **Vercel Project Settings > Environment Variables**:

### Database (Turso)
- `TURSO_DATABASE_URL`: Your Turso DB URL.
- `TURSO_AUTH_TOKEN`: Your Turso Auth Token.

### Payments (Stripe)
- `STRIPE_SECRET_KEY`: Your Stripe Secret Key.
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe Publishable Key.
- `STRIPE_WEBHOOK_SECRET`: Found in Stripe Dashboard under Developers > Webhooks.
- `STRIPE_STARTER_PRICE_ID`: Create a product in Stripe for $49/mo and copy the Price ID.
- `STRIPE_GROWTH_PRICE_ID`: Create a product for $99/mo.
- `STRIPE_PRO_PRICE_ID`: Create a product for $199/mo.
- `STRIPE_DONE_FOR_YOU_PRICE_ID`: Create a one-time product for $497.

### AI & Email
- `OPENAI_API_KEY`: From OpenAI platform.
- `RESEND_API_KEY`: From Resend.
- `EMAIL_FROM`: The email address people will see (e.g., `hello@yourdomain.com`).

### Authentication
- `NEXTAUTH_SECRET`: Run `openssl rand -base64 32` to generate a secure random string.
- `NEXTAUTH_URL`: Your production URL (e.g., `https://customer-comeback.vercel.app`).

## 3. Launch Steps
1. **Push Code**: Ensure all code is pushed to your GitHub repository.
2. **Deploy to Vercel**: Connect your GitHub repo to Vercel.
3. **Add Env Vars**: Enter all the keys listed above in Vercel.
4. **Setup Webhook**: In Stripe, set your webhook URL to `https://yourdomain.com/api/stripe/webhook` and enable the `checkout.session.completed` event.
5. **Hit Redeploy**: Trigger a fresh build on Vercel to apply the settings.

## 4. How to Get Your First 10 Customers
1. **The "Free Gift" Strategy**: Post the link to your "Free Follow-Up Generator" in local business Facebook groups. Tell them: "I built a free tool for local shops to get more reviews. No catch, just hope it helps!"
2. **Direct Outreach**: Use the "Outreach Pitches" provided in the `OUTREACH_PITCHES/` folder. Send these to 20 local businesses in your city via Instagram DM or Email.
3. **QR Code Demo**: Go to a local coffee shop you visit often. Show the owner the QR code system on your phone. Offer them a 1-month free trial to "build their list."

## 5. What to Post Online
Check the `marketing_week_1.md` and `marketing_week_2.md` files for 14 days of pre-written social media posts.
- **Facebook**: Share stories of "Missing Customers" and how follow-up brings them back.
- **LinkedIn**: Focus on the ROI of a repeat customer vs. a new lead.
- **Instagram**: Post a photo of a QR code sign and say "Turn every visitor into a lifetime fan."

## 6. Testing the App
1. **Free Tool**: Go to `/free-tool` and fill it out. Ensure you receive the email.
2. **Checkout**: Go to `/pricing` and click "Buy." (Use Stripe Test Mode first!)
3. **Onboarding**: Complete the onboarding form after "purchase."
4. **Dashboard**: Check your dashboard to see your QR code and new customer stats.

---
**Need help?** Check the internal `AGENTS.md` for team capabilities or contact support.
