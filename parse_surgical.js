#!/usr/bin/env node
// Parse and display the Surgical 49 leads in a clean format
const fs = require('fs');
const content = fs.readFileSync('/home/team/shared/REPORTS/INNOVATION/surgical_hurting_leads.csv', 'utf8');
const lines = content.trim().split('\n');

// Parse header and data (rough parse since some fields contain commas)
const headers = ['business', 'city', 'niche', 'rating', 'reviews', 'has_booking', 'opportunity_score', 'priority', 'reason', 'signals', 'email', 'outreach', 'hurt_severity', 'pain_points'];

// Parse by reading the first field (business), then the rest we grab from the end (email is a known field)
const leads = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  // Find key fields by pattern
  const emailMatch = line.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const email = emailMatch ? emailMatch[1] : '';
  
  // Find hurt_severity pattern
  const severityMatch = line.match(/(SEVERE.*?|CRITICAL.*?|MODERATE.*?)(?:\s*\|\s*|$)/);
  
  // Extract business name (first field before first comma)
  const parts = line.split(',');
  const business = parts[0];
  const city = parts[1];
  const niche = parts[2];
  
  // Find severity score (the number before the comma after hurt_severity)
  const hurtScores = line.match(/(\d+),"(SEVERE|CRITICAL|MODERATE)/);
  let hurtSeverity = '';
  if (hurtScores) {
    hurtSeverity = hurtScores[2] + ' ' + hurtScores[1];
  }
  
  leads.push({ business, city, niche, email, hurtSeverity });
}

// Sort by severity: CRITICAL first, then SEVERE, then MODERATE
const severityOrder = { 'CRITICAL': 0, 'SEVERE': 1, 'MODERATE': 2, '': 3 };
leads.sort((a, b) => {
  const aOrder = severityOrder[a.hurtSeverity.split(' ')[0]] || 3;
  const bOrder = severityOrder[b.hurtSeverity.split(' ')[0]] || 3;
  return aOrder - bOrder;
});

console.log(`Total leads parsed: ${leads.length}\n`);
console.log('=== PRIORITY ORDER ===\n');

let currentSeverity = '';
for (const l of leads) {
  const sev = l.hurtSeverity.split(' ')[0] || 'NONE';
  if (sev !== currentSeverity) {
    currentSeverity = sev;
    console.log(`\n--- ${currentSeverity} ---`);
  }
  console.log(`${l.business} | ${l.city} | ${l.niche} | ${l.email}`);
}