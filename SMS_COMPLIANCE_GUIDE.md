# 📱 SMS Marketing Compliance & Provider Guide

For "Customer Comeback Machine," implementing SMS is a high-leverage feature for the **Pro Plan ($199/mo)**. Here is everything you need to know about setting it up safely and legally.

## 1. Recommended SMS Provider: Twilio
Twilio is the industry standard for automated SMS. It integrates perfectly with Next.js and has robust compliance tools.

- **Account Needed:** Twilio Standard Account (Pay-as-you-go).
- **Cost:** ~$0.0079 per message sent.
- **Setup:** You will need a verified **A2P 10DLC** (Application-to-Person 10-Digit Long Code) registration. This is a legal requirement in the US to prevent spam.

## 2. The 3 Golden Rules of SMS Compliance (TCPA & CTIA)
Text messaging has stricter rules than email. If you break these, you can be fined up to $1,500 *per text*.

### Rule #1: Clear Express Consent
- **Action:** Customers MUST check a box on the opt-in page specifically for SMS. 
- **Requirement:** It cannot be pre-checked. 
- **Language:** "By checking this box, you agree to receive automated marketing text messages from [Business Name] at the number provided. Consent is not a condition of purchase. Message and data rates may apply."

### Rule #2: The "STOP" Instruction
- **Action:** Every single marketing text MUST include opt-out instructions.
- **Requirement:** End every message with "Reply STOP to unsubscribe" or "Txt STOP to opt out."
- **Automation:** Twilio handles "STOP" keywords automatically by blocking further messages to that number, but we should also update our database.

### Rule #3: Double Opt-In (Best Practice)
- When a customer signs up, send an immediate text: "Welcome to [Business Name]'s VIP Club! Reply YES to confirm you want to receive our special offers (max 4/mo)."
- This protects you and ensures high delivery rates.

## 3. Pro Plan SMS Sequence Strategy
Since SMS is more intrusive than email, use it sparingly:

1.  **Immediate Welcome:** "Thanks for joining [Business Name]'s club! Show this text for your [Offer] today!"
2.  **Birthday Treat:** "Happy Birthday from [Business Name]! 🎈 Enjoy a free treat on us this week: [Link]"
3.  **High-Value Flash Sale:** "Flash Sale at [Business Name]! 20% off everything until 5 PM today. See you soon!"

## 4. Legal Record Keeping
- We store the `consent_timestamp` and `source` (QR code/Web) for every lead in our database.
- We must keep these records for at least 4 years to defend against any TCPA claims.

---
**Status:** This guide is ready for the Architect to implement the Twilio integration for Pro Plan users.
