const fs = require("fs");
const { execSync } = require("child_process");

const CSV_FILE = "/home/team/shared/REPORTS/INNOVATION/high_intent_opportunity_leads.csv";
const DB_FILE = "/home/team/shared/austin_leads_v2.db";

function run() {
    const content = fs.readFileSync(CSV_FILE, "utf8");
    const lines = content.split("\n");
    let count = 0;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || !line.includes("Austin")) continue;

        // Correct CSV parsing for quoted fields
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (parts.length >= 12) {
            const name = parts[0].replace(/"/g, "").trim();
            const city = parts[1].replace(/"/g, "").trim();
            const niche = parts[2].replace(/"/g, "").trim();
            const email = parts[10].replace(/"/g, "").trim();

            if (email.includes("@")) {
                const id = "csv-" + i;
                const sql = `INSERT OR IGNORE INTO leads (id, email, business_name, business_type, city) VALUES ('${id}', '${email}', '${name.replace(/'/g, "''")}', '${niche.replace(/'/g, "''")}', '${city.replace(/'/g, "''")}');`;
                try {
                    execSync(`sqlite3 "${DB_FILE}" "${sql}"`);
                    count++;
                } catch (e) {
                    console.error(`Failed to insert ${email}: ${e.message}`);
                }
            }
        }
    }
    console.log(`Successfully imported ${count} Austin leads.`);
}

run();
