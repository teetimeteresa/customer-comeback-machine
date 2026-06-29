#!/bin/bash
# Export Austin leads from team-db to local SQLite
# Uses the locked wrapper + sqlite3 CLI

LOCAL_DB="/home/team/shared/austin_leads.db"

echo "=== Exporting Austin leads to local DB ==="

# Get leads as JSON via team-db and convert to SQL inserts
LEADS_JSON=$(cd /home/team/shared && scripts/team-db-locked.sh "SELECT id, email, business_name, business_type, city FROM leads WHERE high_intent = 1 AND sales_email_sent = 0 AND (LOWER(city) LIKE '%austin%' OR LOWER(city) LIKE '%atx%' OR LOWER(state) LIKE '%tx%') LIMIT 5500" 2>/dev/null)

if [ -z "$LEADS_JSON" ] || [ "$LEADS_JSON" = "[]" ]; then
    echo "No results from team-db, trying smaller query..."
    LEADS_JSON=$(cd /home/team/shared && scripts/team-db-locked.sh "SELECT id, email, business_name, business_type, city FROM leads WHERE high_intent = 1 AND sales_email_sent = 0 LIMIT 500" 2>/dev/null)
fi

echo "Processing leads..."

# Create SQLite table if not exists
sqlite3 "$LOCAL_DB" "CREATE TABLE IF NOT EXISTS leads (id TEXT PRIMARY KEY, email TEXT, business_name TEXT, business_type TEXT, city TEXT, sales_email_sent INTEGER DEFAULT 0, high_intent INTEGER DEFAULT 1)"

# Clear existing
sqlite3 "$LOCAL_DB" "DELETE FROM leads"

# Parse JSON and insert using Node (which is available via PATH)
node -e "
const leads = $LEADS_JSON || [];
if (!leads.length) { console.log('No leads found'); process.exit(0); }
const { execSync } = require('child_process');
const db = '/home/team/shared/austin_leads.db';
let count = 0;
for (const l of leads) {
  const id = (l.id || '').replace(/'/g, '''');
  const email = (l.email || '').replace(/'/g, '''');
  const name = (l.business_name || '').replace(/'/g, '''');
  const type = (l.business_type || '').replace(/'/g, '''');
  const city = (l.city || '').replace(/'/g, '''');
  const sql = \"INSERT OR IGNORE INTO leads (id, email, business_name, business_type, city) VALUES ('\" + id + \"', '\" + email + \"', '\" + name + \"', '\" + type + \"', '\" + city + \"')\";
  try {
    execSync('sqlite3 \"' + db + '\" \"' + sql + '\"', { stdio: 'pipe' });
    count++;
  } catch(e) {}
}
console.log('Inserted ' + count + ' leads into local DB');
"

echo "=== Export complete ==="
sqlite3 "$LOCAL_DB" "SELECT COUNT(*) as total FROM leads"