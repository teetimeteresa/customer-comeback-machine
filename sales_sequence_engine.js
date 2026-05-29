const { execSync } = require('child_process');

function db(query) {
    const output = execSync(`team-db "${query.replace(/"/g, '\\"')}"`).toString();
    try {
        return JSON.parse(output);
    } catch (e) {
        return output;
    }
}

const SEQUENCE = [
    { step: 1, delay: 0, subject: "Your Free Follow-Up Templates" },
    { step: 2, delay: 2, subject: "Why 70% of customers never come back" },
    { step: 3, delay: 5, subject: "The 'Invisible' Profit in your shop" },
    { step: 4, delay: 10, subject: "How to get 5-star reviews on autopilot" },
    { step: 5, delay: 15, subject: "Introducing Customer Comeback Machine" },
    { step: 6, delay: 20, subject: "Pricing & Quick Setup" },
    { step: 7, delay: 25, subject: "Final reminder: Stop letting customers disappear" }
];

async function run() {
    console.log("Running Sales Sequence Engine...");
    
    // Get all leads in the sequence
    const leads = db("SELECT * FROM leads WHERE last_sequence_step > 0");
    
    const now = new Date();
    
    for (const lead of leads) {
        const nextStep = SEQUENCE.find(s => s.step === lead.last_sequence_step + 1);
        if (!nextStep) continue;
        
        const lastAt = new Date(lead.last_sequence_at);
        const diffDays = (now - lastAt) / (1000 * 60 * 60 * 24);
        
        const requiredDelaySinceFirst = nextStep.delay;
        const createdDate = new Date(lead.created_at);
        const daysSinceCreated = (now - createdDate) / (1000 * 60 * 60 * 24);
        
        if (daysSinceCreated >= requiredDelaySinceFirst) {
            console.log(`Sending Step ${nextStep.step} to ${lead.email}...`);
            
            // Log to marketing_log
            const content = `Sales Email ${nextStep.step}: ${nextStep.subject} sent to ${lead.email}`;
            db(`INSERT INTO marketing_log (channel, content, timestamp, engagement_clicks, engagement_likes) VALUES ('Email', '${content}', datetime('now'), 0, 0)`);
            
            // Update lead
            db(`UPDATE leads SET last_sequence_step = ${nextStep.step}, last_sequence_at = datetime('now') WHERE id = '${lead.id}'`);
        }
    }
}

run();
