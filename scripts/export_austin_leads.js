const { spawnSync } = require('child_process');
const fs = require('fs');
const { Database } = require('better-sqlite3');

// Load team-db locked wrapper
function runQuery(sql) {
  const res = spawnSync('/home/team/shared/scripts/team-db-locked.sh', [sql], { maxBuffer: 50 * 1024 * 1024 });
  if (res.status === 0) {
    try { return JSON.parse(res.stdout.toString()); } catch (e) { return []; }
  }
  return [];
}

// Create local SQLite DB
const db = new Database('/home/team/shared/austin_leads.db');
db.exec(`CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  email TEXT,
  business_name TEXT,
  business_type TEXT,
  city TEXT,
  sales_email_sent INTEGER DEFAULT 0,
  high_intent INTEGER DEFAULT 1
)`);

// Get Austin leads
let austinLeads = [];

// Try Austin-specific query
const results = runQuery("SELECT id, email, business_name, business_type, city FROM leads WHERE high_intent = 1 AND sales_email_sent = 0 AND (LOWER(city) LIKE '%austin%' OR LOWER(city) LIKE '%atx%' OR LOWER(business_type) LIKE '%coffee%' OR LOWER(business_type) LIKE '%salon%') LIMIT 5500");

if (results && results.length > 0) {
  austinLeads = results;
  console.log(`Found ${results.length} Austin/priority leads`);
} else {
  // Fallback: get any high intent leads
  const fallback = runQuery("SELECT id, email, business_name, business_type, city FROM leads WHERE high_intent = 1 AND sales_email_sent = 0 LIMIT 500");
  austinLeads = fallback || [];
  console.log(`Found ${austinLeads.length} fallback leads`);
}

// Clear and repopulate local DB
db.exec('DELETE FROM leads');
const insert = db.prepare('INSERT OR IGNORE INTO leads (id, email, business_name, business_type, city) VALUES (?, ?, ?, ?, ?)');
const insertMany = db.transaction((leads) => {
  for (const l of leads) {
    insert.run(l.id, l.email, l.business_name || '', l.business_type || '', l.city || '');
  }
});
insertMany(austinLeads);
console.log(`Inserted ${austinLeads.length} leads into local DB`);
db.close();