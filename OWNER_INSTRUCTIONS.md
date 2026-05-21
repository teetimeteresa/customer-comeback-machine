# Customer Comeback Machine - Setup & Launch Instructions

Congratulations! Your automated SaaS business, **Customer Comeback Machine**, is built and ready for launch. This app is designed to help local businesses turn one-time visitors into repeat customers on autopilot.

## 1. Accounts You Need
To run this business, you will need the following accounts:
*   **Turso:** For the hosted SQLite database.
*   **Stripe:** For processing payments and managing subscriptions.
*   **Resend:** For sending automated emails to businesses and their customers.
*   **OpenAI:** For the AI message generation engine.
*   **Vercel (Recommended):** For hosting the Next.js application.

## 2. API Keys & Environment Variables
Copy `.env.example` to `.env` and fill in the following values:
*   `TURSO_DATABASE_URL` & `TURSO_AUTH_TOKEN`: From your Turso dashboard.
*   `STRIPE_SECRET_KEY` & `STRIPE_WEBHOOK_SECRET`: From your Stripe dashboard.
*   `RESEND_API_KEY`: From your Resend dashboard.
*   `OPENAI_API_KEY`: From your OpenAI dashboard.
*   `NEXTAUTH_SECRET`: A random string for session security.
*   `NEXT_PUBLIC_APP_URL`: Your production URL (e.g., `https://customer-comeback.com`).

## 3. Stripe Setup
1.  Create three **Products** in Stripe for the subscription plans:
    *   **Starter Plan:** $49/month
    *   **Growth Plan:** $99/month
    *   **Pro Plan:** $199/month
2.  Create a one-time product for the **"Done-for-You Setup"**: $497.
3.  Add the **Price IDs** to your `.env` file.
4.  Configure the Stripe Webhook to point to `your-domain.com/api/stripe/webhook`.

## 4. Email Setup (Resend)
1.  Verify your domain in Resend.
2.  Set up your "From" email address in the application code or as an environment variable.
3.  Test the email flow by signing up as a lead through the **Free Tool**.

## 5. How to Test the App
1.  **Lead Magnet:** Go to `/free-tool`, enter your info, and ensure you receive the results email and are added to the `leads` table.
2.  **Signup & Payment:** Create a new business account at `/signup`, choose a plan, and complete the Stripe checkout.
3.  **Onboarding:** After payment, ensure you are redirected to `/onboarding` and can fill out your business profile.
4.  **Dashboard:** Verify that your QR code is generated and your (empty) customer list is visible.
5.  **Opt-in:** Scan your business QR code (or go to `/optin/[your-slug]`) and sign up as a customer. Check that the "Welcome" email is triggered.

## 6. How to Launch & Get Your First 10 Customers
1.  **Target Local Businesses:** Focus on boutiques, salons, and coffee shops in your local area.
2.  **Use the Free Tool:** Promote the "What Follow-Up Should I Send My Customer?" tool on social media to capture leads.
3.  **Direct Outreach:** Visit local businesses in person. Bring a sample "Customer Comeback QR Sign" with their logo to show them how easy it is.
4.  **Offer the "Done-for-You" Setup:** Many small business owners are overwhelmed. The $497 setup fee is an easy way to get them started with zero effort on their part.
5.  **Leverage the Blog:** We've pre-written 10 SEO-optimized blog posts. Publish these weekly to build authority and attract search traffic.

## 7. What to Post Online
Use the content generated in `/home/team/shared/marketing_week_1.md` and `marketing_week_2.md`.
*   **Facebook/LinkedIn:** Post the "Reality Check" and "Economics of Retention" articles.
*   **Instagram/TikTok:** Use the short video scripts to create simple "owner-perspective" videos.

## Technical Support
The codebase is structured using **Next.js 15**, **Tailwind CSS**, and **TypeScript**. All database interactions are handled via a shared utility in `src/lib/team-db.ts`.

Good luck! You're ready to start bringing customers back.
