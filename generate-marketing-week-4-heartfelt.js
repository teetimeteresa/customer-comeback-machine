const fs = require('fs');
const path = require('path');

// Configuration
const OPENAI_API_KEY = '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';

async function generateMarketingContent() {
    console.log("Generating Week 4 (Heartfelt Blitz) Marketing Content...");
    
    const prompt = `
    You are an expert content strategist for "Customer Comeback Machine," a SaaS that helps small local businesses (boutiques, salons, coffee shops) automate their customer follow-up (thank-yous, reviews, comeback offers, birthday rewards).
    
    Generate Week 4 marketing content. 
    Theme: "Heartfelt Blitz: Tending to Your Community, Even When You're Not There."
    
    Include:
    1. 5 Facebook posts (warm, community-focused, includes emojis)
    2. 5 LinkedIn posts (professional, data-driven, focus on ROI and efficiency, but heart-centered)
    3. 3 short video scripts (15-30 seconds each, for Instagram Reels/TikTok)
    4. 3 blog post drafts (Headlines and key bullet points)
    5. 5 Pinterest pin titles & descriptions
    6. 1 email newsletter (Subject line and body)
    
    Specific Reframing Instructions:
    - Empathy First: Reframe "automation" as "Tending to Your Community, Even When You're Not There."
    - The "Invisible Employee": Reframe the system as an "invisible, loving employee" who never forgets a birthday and always says thank you.
    - Focus on the "Connection Gap": Remove the guilt owners feel for not following up.
    
    Topics to cover:
    - How local businesses can compete with big stores using heart and personalization.
    - Why "thank you" messages are a gift that creates loyalty.
    - How to ask for reviews in a way that feels like a natural conversation among neighbors.
    - The power of having a "Quiet Partner" handling the details.
    
    Design style: Clean, Warm, Modern, Friendly, Trustworthy, Not corporate.
    
    Output the result in Markdown format.
    `;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are a world-class marketing copywriter specializing in empathy-driven marketing for small businesses." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        const filePath = '/home/team/shared/marketing_week_4_heartfelt.md';
        fs.writeFileSync(filePath, content);
        console.log(`Marketing content generated and saved to ${filePath}`);
        return true;
    } catch (error) {
        console.error("Error generating marketing content:", error);
        return false;
    }
}

generateMarketingContent();
