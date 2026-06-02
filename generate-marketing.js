const fs = require('fs');
const path = require('path');

// Configuration
const OPENAI_API_KEY = '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';

async function generateMarketingContent() {
    console.log("Generating Week 5 Marketing Content...");
    
    const prompt = `
    You are an expert content strategist for "Customer Comeback Machine," a SaaS that helps small local businesses (boutiques, salons, coffee shops) automate their customer follow-up (thank-yous, reviews, comeback offers, birthday rewards).
    
    Generate Week 5 marketing content. 
    Theme: "The Human Side of Automation: Building Relationships while you Sleep."
    
    Include:
    1. 5 Facebook posts (warm, community-focused, includes emojis)
    2. 5 LinkedIn posts (professional, data-driven, focus on ROI and efficiency)
    3. 3 short video scripts (15-30 seconds each, for Instagram Reels/TikTok)
    4. 3 blog post drafts (Headlines and key bullet points)
    5. 5 Pinterest pin titles & descriptions
    6. 1 email newsletter (Subject line and body)
    
    Topics to cover:
    - Why "thank you" messages create loyalty
    - How local businesses can compete with big stores using personalization
    - How to ask for reviews without feeling awkward
    
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
                    { role: "system", content: "You are a world-class marketing copywriter." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        const filePath = '/home/team/shared/marketing_week_5.md';
        fs.writeFileSync(filePath, content);
        console.log(`Marketing content generated and saved to ${filePath}`);
        return true;
    } catch (error) {
        console.error("Error generating marketing content:", error);
        return false;
    }
}

generateMarketingContent();
