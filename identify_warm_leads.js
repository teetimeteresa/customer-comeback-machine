const { execSync } = require('child_process');

function db(query) {
    try {
        const output = execSync(`team-db "${query.replace(/"/g, '\\"')}"`).toString();
        try {
            return JSON.parse(output);
        } catch (e) {
            return output;
        }
    } catch (err) {
        return [];
    }
}

async function run() {
    console.log("Analyzing Leads for Warmth...");
    
    // High-intent criteria:
    // 1. Has generated_content (not just email collected)
    // 2. Has business_type AND customer_type
    // 3. Has goal
    
    const leads = db("SELECT * FROM leads");
    
    if (!Array.isArray(leads)) {
        console.error("Failed to fetch leads or database locked.");
        return;
    }

    const warmLeads = leads.filter(l => {
        const hasContent = l.generated_content && l.generated_content.length > 50;
        const hasBusinessInfo = l.business_type && l.customer_type;
        const hasGoal = l.goal && l.goal !== "";
        return hasContent && hasBusinessInfo && hasGoal;
    });

    console.log(`Total Leads: ${leads.length}`);
    console.log(`Warm Leads (High-Intent): ${warmLeads.length}`);
    
    if (warmLeads.length > 0) {
        console.log("\nSample Warm Leads:");
        warmLeads.slice(0, 5).forEach(l => {
            console.log(`- ${l.email} (${l.business_type}): ${l.goal}`);
        });
    }
}

run();
