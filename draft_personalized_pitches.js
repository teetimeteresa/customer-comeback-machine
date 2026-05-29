const fs = require('fs');
const { execSync } = require('child_process');

const OPENAI_API_KEY = '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';

async function generatePitches() {
    console.log("Fetching high-intent leads...");
    const leadsOutput = execSync(`team-db "SELECT id, email, business_type, customer_type, tone, goal FROM leads WHERE generated_content != '' AND generated_content IS NOT NULL"`).toString();
    const leads = JSON.parse(leadsOutput);

    console.log(`Generating personalized pitches for ${leads.length} leads...`);
    const pitches = [];

    for (const lead of leads) {
        const prompt = `
        You are a high-touch sales strategist for "Customer Comeback Machine."
        
        Lead Details:
        - Business Type: ${lead.business_type}
        - Their Goal with the tool: ${lead.goal}
        - Their preferred Tone: ${lead.tone}
        - Email: ${lead.email}
        
        This lead used our "What Follow-Up Should I Send?" tool. 
        
        Draft a personalized, empathetic, and compelling outreach message (100-150 words). 
        The tone should match THEIR preferred tone (${lead.tone}).
        
        Include:
        1. A reference to their specific business type and the goal they chose.
        2. Why a "Machine" approach (automation) is better than manual follow-up for a busy owner.
        3. A soft call-to-action for a "5-minute loyalty audit" or a personalized demo.
        4. Mention that you've already pre-built a custom automation sequence for them based on their inputs.
        
        Output ONLY the message body. No subject line.
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
                        { role: "system", content: "You are a world-class customer success and sales strategist." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            const pitch = data.choices[0].message.content;
            
            pitches.push({
                lead_id: lead.id,
                email: lead.email,
                business_type: lead.business_type,
                pitch: pitch
            });
            process.stdout.write('.');
            
            // Save after each one so teammates can see progress
            fs.writeFileSync('/home/team/shared/personalized_warm_pitches.json', JSON.stringify(pitches, null, 2));
            
        } catch (error) {
            console.error(`\nError generating pitch for ${lead.email}:`, error);
        }
    }
    console.log(`\nGenerated ${pitches.length} pitches.`);
}

generatePitches();
