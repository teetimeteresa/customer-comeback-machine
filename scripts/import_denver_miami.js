const fs = require("fs");
const { execSync } = require("child_process");

const CSV_FILE = "/home/team/shared/REPORTS/INNOVATION/gmaps_denver_miami_leads_with_emails.csv";
const DB_FILE = "/home/team/shared/austin_leads_v2.db"; // We'll keep using the same "hardened" DB for now

function run() {
    if (!fs.existsSync(CSV_FILE)) {
        console.error(`CSV file not found: ${CSV_FILE}`);
        return;
    }
    const content = fs.readFileSync(CSV_FILE, "utf8");
    const lines = content.split("\n");
    let count = 0;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Correct CSV parsing for quoted fields
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (parts.length >= 11) {
            const name = parts[0].replace(/"/g, "").trim();
            const city = parts[1].replace(/"/g, "").trim();
            const niche = parts[3].replace(/"/g, "").trim();
            const email = parts[10].replace(/"/g, "").trim();

            if (email && email.includes("@")) {
                const id = "den-mia-" + i;
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
    console.log(`Successfully imported ${count} Denver/Miami leads.`);
}

run();
