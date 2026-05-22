import { NextRequest, NextResponse } from 'next/server';
import { generateId, timestamp, teamDb } from '@/lib/db';

// Content templates based on tone
const contentTemplates: Record<string, Record<string, string[]>> = {
  friendly: {
    thankYou: [
      "Hey {name}! It was so great seeing you today. Thanks for supporting our small business—it really means a lot to us!",
      "Hi there! We loved having you in today. Your support keeps our dream alive!",
    ],
    reviewRequest: [
      "We're so glad you stopped by! If you have 30 seconds, would you mind sharing the love with a quick Google review? It helps neighbors find us!",
      "Had a great time with you! Could you take a moment to share the love on Google? It really helps us grow!",
    ],
    comebackOffer: [
      "Already thinking about your next visit? Use code COMEBACK for 10% off your next stop. See you soon!",
      "We'd love to see you again! Here's 10% off your next visit—use code MISSYOU at checkout.",
    ],
    referral: [
      "Friends don't let friends miss out on the good stuff. Refer a friend and you both get a little treat on us!",
      "Know someone who'd love us? Share the word and we'll send you a thank-you treat!",
    ],
    socialCaption: [
      "Nothing makes our day like seeing a happy face in the shop. ✨ Come say hi soon! #ShopLocal",
      "The best part of our day? Happy customers like you! 💕 Come visit us again soon!",
    ],
  },
  funny: {
    thankYou: [
      "Our shop feels 110% cooler now that you've been in it. Thanks for stopping by!",
      "You just made our day. Thanks for gracing us with your presence! 😎",
    ],
    reviewRequest: [
      "Is it too early in the relationship to ask for a favor? If you liked us, could you tell Google? We promise not to make it weird.",
      "You're our favorite customer right now. Could you do us a solid and drop us a review? We won't make it weird... much.",
    ],
    comebackOffer: [
      "Absence makes the heart grow fonder, but a discount makes it beat faster. Use code MISSYOU for a special treat next time you're in.",
      "We miss you already! Use code COMEBACK for 10% off—because happy hour shouldn't just be for drinks.",
    ],
    referral: [
      "Found a new favorite spot? Don't be a gatekeeper. Tell a friend and we'll reward your good taste.",
      "You're in the know. Don't leave your friends behind! Share the love and we'll send you a thank-you.",
    ],
    socialCaption: [
      "Just out here waiting for our favorite customers to come back. (That's you). #LocalFaves",
      "Warning: May cause extreme happiness, loyalty, and an inexplicable urge to visit again. Side effects of shopping local. 😄",
    ],
  },
  professional: {
    thankYou: [
      "Thank you for choosing us. We appreciate your business and look forward to serving you again.",
      "We value your patronage. Thank you for supporting our business—we won't take that lightly.",
    ],
    reviewRequest: [
      "We hope your experience was a positive one. If you have a moment, we'd appreciate your feedback on Google.",
      "Your opinion matters to us. If you enjoyed your visit, we'd be grateful for a quick review.",
    ],
    comebackOffer: [
      "As a returning customer, we'd like to offer you an exclusive 10% discount on your next visit. Use code RETURN10.",
      "We appreciate your loyalty. Here's a special offer for our valued customer: 10% off your next visit.",
    ],
    referral: [
      "Know someone who could benefit from our services? We'd be honored by your recommendation. Ask about our referral program!",
      "We're always looking to help new customers. If you know someone who'd be a great fit, we'd love an introduction.",
    ],
    socialCaption: [
      "Quality service. Quality products. Quality community. Thank you for being part of ours.",
      "Proud to serve our community. Come see what we're all about! #ShopLocal",
    ],
  },
  luxury: {
    thankYou: [
      "It was a pleasure hosting you today. We appreciate your discerning taste and your support.",
      "Thank you for choosing us. We look forward to creating more exceptional moments for you.",
    ],
    reviewRequest: [
      "We hope your experience was nothing short of exceptional. We would be honored if you shared your thoughts with a brief review.",
      "Your feedback is invaluable to us. We would be grateful for a moment of your time to share your experience.",
    ],
    comebackOffer: [
      "We look forward to your return. As a token of our appreciation, please enjoy a complimentary add-on with your next booking.",
      "We'd love to welcome you back. As a valued client, you're entitled to priority booking and exclusive perks.",
    ],
    referral: [
      "Excellence is best shared. Invite a guest to experience our services, and we will provide a special credit to both of your accounts.",
      "If you know someone who appreciates the finer things, we'd be honored to welcome them. Speak to us about our referral program.",
    ],
    socialCaption: [
      "Curating moments of elegance for our most valued guests. Discover what's new. ✨ #LuxuryExperience",
      "Where every detail matters. Thank you for being part of our story. #VIPExperience",
    ],
  },
  heartfelt: {
    thankYou: [
      "Thank you from the bottom of our hearts for choosing us. We know you have choices, and we're so grateful.",
      "You made our day brighter. Thank you for your support—it means the world to our small team.",
    ],
    reviewRequest: [
      "Your support means the world to our small team. Would you mind sharing a few words about your experience? It truly helps us grow.",
      "We put our whole heart into what we do. If you felt that, we'd love to hear about it. A review would mean so much.",
    ],
    comebackOffer: [
      "We've been thinking about you! We'd love to see you again soon. Here's a little something to make your next visit extra special.",
      "You left a mark on our hearts (and not just in the guest book). Come back and see us soon! Use code WE MISSYOU for a treat.",
    ],
    referral: [
      "Small businesses are built on love and word-of-mouth. If you know someone who would appreciate what we do, we'd be honored by the introduction.",
      "You know us best. If you know someone who deserves a little extra love, we'd be so grateful for the introduction.",
    ],
    socialCaption: [
      "Grateful for the community that keeps our dream alive. Thank you for being part of it. ❤️ #CommunityLove",
      "This is what it's all about—moments like the one we shared with you today. Thank you. 💕",
    ],
  },
  simple: {
    thankYou: [
      "Thanks for stopping by! We appreciate your business.",
      "Thank you! See you again soon.",
    ],
    reviewRequest: [
      "If you enjoyed your visit, we'd love a quick review on Google. It helps us a lot!",
      "Have a moment? We'd appreciate a quick Google review. Thanks!",
    ],
    comebackOffer: [
      "Come back soon! Use code WELCOME10 for 10% off your next visit.",
      "We'd love to see you again. Here's 10% off your next visit—code RETURN10.",
    ],
    referral: [
      "Know someone who might like us? Tell them about us and you'll get a thank-you treat!",
      "Help us grow! Refer a friend and we'll take care of you both.",
    ],
    socialCaption: [
      "Thanks for being part of our story! #ShopLocal #SupportSmall",
      "Great to see you today! Come back anytime. #LocalLove",
    ],
  },
};

// Goal-specific content
const goalContent: Record<string, string> = {
  birthday_list: "Want a gift on your big day? Join our Birthday Club! Just fill out the form to tell us when to celebrate you.",
  appointment_booking: "Ready for your next refresh? We're filling up fast. Book your next appointment here and grab your favorite time slot!",
  thank_you: "Just wanted to say thanks again for stopping by. We appreciate you!",
};

function getRandomItem(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function customizeContent(
  content: string,
  businessType: string,
  customerAction: string,
  businessName?: string
): string {
  let customized = content;
  
  // Customize based on business type
  const businessTypeMap: Record<string, string> = {
    boutique: 'boutique',
    salon: 'salon',
    coffee_shop: 'coffee shop',
    bakery: 'bakery',
    med_spa: 'med spa',
    photographer: 'photo studio',
    fitness_studio: 'studio',
    optical_shop: 'shop',
    florist: 'flower shop',
    gift_shop: 'gift shop',
    downtown_retailer: 'store',
    local_service: 'business',
  };
  
  const businessLabel = businessTypeMap[businessType] || 'shop';
  
  customized = customized
    .replace(/\[Business Type\]/gi, businessLabel)
    .replace(/{name}/g, businessName || 'there')
    .replace(/\[Business Name\]/g, businessName || 'our business')
    .replace(/\[Name\]/g, businessName || 'there');
  
  return customized;
}

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      businessType,
      customerType,
      whatCustomerBought,
      tone,
      goal,
      businessName,
    } = await request.json();

    // Generate content
    const templates = contentTemplates[tone] || contentTemplates.friendly;
    
    const thankYouMessage = customizeContent(
      getRandomItem(templates.thankYou),
      businessType,
      customerType,
      businessName
    );
    
    const reviewRequest = customizeContent(
      getRandomItem(templates.reviewRequest),
      businessType,
      customerType,
      businessName
    );
    
    const comebackOffer = customizeContent(
      getRandomItem(templates.comebackOffer),
      businessType,
      customerType,
      businessName
    );
    
    const referralMessage = customizeContent(
      getRandomItem(templates.referral),
      businessType,
      customerType,
      businessName
    );
    
    const socialCaption = customizeContent(
      getRandomItem(templates.socialCaption),
      businessType,
      customerType,
      businessName
    );

    // Add goal-specific content if applicable
    let goalSpecificMessage = '';
    if (goal === 'birthday_list' || goal === 'appointment_booking' || goal === 'thank_you') {
      goalSpecificMessage = goalContent[goal] || '';
    }

    // Save lead to database
    const leadId = generateId();
    const now = timestamp();
    
    const generatedContent = JSON.stringify({
      thankYouMessage,
      reviewRequest,
      comebackOffer,
      referralMessage,
      socialCaption,
      goalSpecificMessage,
    });

    await teamDb(`
      INSERT INTO leads (id, email, business_type, customer_type, what_customer_bought, tone, goal, generated_content, sales_email_sent, created_at)
      VALUES ('${leadId}', '${email}', '${businessType}', '${customerType}', '${whatCustomerBought}', '${tone}', '${goal}', '${generatedContent.replace(/'/g, "''")}', 0, '${now}')
    `);

    // Trigger first sales email asynchronously (don't wait for it)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/email/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId }),
    }).catch(err => console.error('Failed to trigger sales email:', err));

    return NextResponse.json({
      success: true,
      leadId,
      content: {
        thankYouMessage,
        reviewRequest,
        comebackOffer,
        referralMessage,
        socialCaption,
        goalSpecificMessage,
      },
    });
  } catch (error) {
    console.error('Free tool error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
