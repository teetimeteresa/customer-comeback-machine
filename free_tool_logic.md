# Free Tool Logic: “What Follow-Up Should I Send My Customer?”

This document provides the logic and content library for the free lead magnet tool.

## 1. Input Fields
- **Business Type:** [Boutique, Salon, Coffee Shop, Bakery, Med Spa, Photographer, Fitness Studio, Other]
- **Customer Action:** [Bought a product, Booked a service, Just browsed]
- **Brand Tone:** [Friendly, Funny, Professional, Luxury, Heartfelt, Simple]
- **Main Goal:** [Get a Review, Repeat Visit, Referral, Birthday List, Appointment Booking, Thank-You Message]

## 2. Output Format (The Results)
Each result generates 5 pieces of content:
1.  **1 Thank-You Message**
2.  **1 Review Request**
3.  **1 Comeback Offer**
4.  **1 Referral Message**
5.  **1 Social Media Caption**

---

## 3. Content Library (Modular Pieces)

The tool should dynamically assemble these pieces based on the user's inputs. 

### Category: Tone = Friendly (General)
*   **Thank-You:** "Hey [Name]! It was so great seeing you today. Thanks for supporting our small business—it really means a lot to us!"
*   **Review Request:** "We're so glad you stopped by! If you have 30 seconds, would you mind sharing the love with a quick Google review? It helps neighbors find us!"
*   **Comeback Offer:** "Already thinking about your next visit? Use code COMEBACK for 10% off your next stop. See you soon!"
*   **Referral:** "Friends don't let friends miss out on the good stuff. Refer a friend and you both get a little treat on us!"
*   **Social Caption:** "Nothing makes our day like seeing a happy face in the shop. ✨ Come say hi soon! #ShopLocal #[BusinessType]"

### Category: Tone = Funny (General)
*   **Thank-You:** "Our shop feels 110% cooler now that you've been in it. Thanks for stopping by, [Name]!"
*   **Review Request:** "Is it too early in the relationship to ask for a favor? If you liked us, could you tell Google? We promise not to make it weird."
*   **Comeback Offer:** "Absence makes the heart grow fonder, but a discount makes it beat faster. Use code MISSYOU for a special treat next time you're in."
*   **Referral:** "Found a new favorite spot? Don't be a gatekeeper. Tell a friend and we'll reward your good taste."
*   **Social Caption:** "Just out here waiting for our favorite customers to come back. (That's you). 🍕 #LocalFaves #[BusinessType]"

### Category: Tone = Luxury (General/Med Spa/Boutique)
*   **Thank-You:** "It was a pleasure hosting you today, [Name]. We appreciate your discerning taste and your support of [Business Name]."
*   **Review Request:** "We hope your experience was nothing short of exceptional. We would be honored if you shared your thoughts with a brief review."
*   **Comeback Offer:** "We look forward to your return. As a token of our appreciation, please enjoy a complimentary [Add-on] with your next booking."
*   **Referral:** "Excellence is best shared. Invite a guest to experience [Business Name], and we will provide a special credit to both of your accounts."
*   **Social Caption:** "Curating moments of elegance for our most valued guests. Discover what's new. ✨ #LuxuryLife #[BusinessType]"

### Category: Tone = Heartfelt (General/Photographer/Florist)
*   **Thank-You:** "[Name], thank you from the bottom of our hearts for choosing us. We know you have choices, and we're so grateful to be part of your story."
*   **Review Request:** "Your support means the world to our small team. Would you mind sharing a few words about your experience? It truly helps us grow."
*   **Comeback Offer:** "We've been thinking about you! We'd love to see you again soon. Here is a little something to make your next visit extra special."
*   **Referral:** "Small businesses are built on love and word-of-mouth. If you know someone who would appreciate what we do, we'd be honored by the introduction."
*   **Social Caption:** "Grateful for the community that keeps our dream alive. Thank you for being part of it. ❤️ #CommunityLove #[BusinessType]"

---

## 4. Specialized Content (By Goal)

*If the Goal = Birthday List:*
*   **Message:** "Want a gift on your big day? Join our Birthday Club! Just [Link] to tell us when to celebrate you."

*If the Goal = Appointment Booking:*
*   **Message:** "Ready for your next refresh? We're filling up fast for next week. Grab your spot here: [Link]"

---

## 5. Implementation Strategy for Architect
1.  **Selection Logic:** The tool should select the category based on the **Tone** selected.
2.  **Customization:** If the **Business Type** is "Salon," replace generic words like "visit" with "appointment" or "chair."
3.  **Variable Replacement:** The code should replace placeholders like `[Name]` with the user's name (if provided) or `[First Name]` for the template, and `[Business Name]` with their business name.
4.  **Sales Trigger:** Once the user clicks "Generate My Messages," show a "Generating..." animation. Then show an email opt-in: "Where should we send your custom templates?"
5.  **Result Delivery:** After email submission, show the results on screen and trigger Email 1 of the Sales Sequence.
