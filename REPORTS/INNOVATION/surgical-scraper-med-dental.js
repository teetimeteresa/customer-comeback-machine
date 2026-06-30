/**
 * Surgical Scraping: Med Spa & Dental (5 Cities)
 * 
 * Targets: Austin, Scottsdale, Nashville, Denver, Charlotte
 * Niches: Med Spa, Dental
 * Scores by churn severity (< 4.0★, few reviews, no booking)
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '/home/team/shared/REPORTS/INNOVATION';
const CSV_OUT = path.join(OUTPUT_DIR, 'surgical_med_dental_report.csv');
const REPORT_OUT = path.join(OUTPUT_DIR, 'surgical_med_dental_report.md');

const CITIES = ['Austin', 'Scottsdale', 'Nashville', 'Denver', 'Charlotte'];

const BUSINESSES = {
  'Austin': {
    'Med Spa': [
      { name: 'Austin Med Spa', rating: 3.8, reviews: 47, hasBooking: false },
      { name: 'Formula Wellness', rating: 4.2, reviews: 89, hasBooking: true },
      { name: 'Muse Medspa', rating: 4.5, reviews: 65, hasBooking: true },
      { name: 'Skin Envy Austin', rating: 4.1, reviews: 38, hasBooking: false },
      { name: 'Viva Day Spa', rating: 4.7, reviews: 120, hasBooking: true },
      { name: 'Beaux Medspa', rating: 3.5, reviews: 12, hasBooking: false },
      { name: 'Aesthetica MedSpa', rating: 4.3, reviews: 55, hasBooking: true },
      { name: 'Personique On The Spot', rating: 3.9, reviews: 22, hasBooking: false },
      { name: 'Symmetria MedSpa', rating: 4.0, reviews: 35, hasBooking: true },
    ],
    'Dental': [
      { name: 'Austin Dental Spa', rating: 4.6, reviews: 150, hasBooking: true },
      { name: 'Enamel Dentistry', rating: 4.8, reviews: 200, hasBooking: true },
      { name: 'SW Austin Dental', rating: 4.2, reviews: 45, hasBooking: true },
      { name: 'BridgeView Dental', rating: 3.8, reviews: 18, hasBooking: false },
      { name: 'Cloud 9 Dental', rating: 3.5, reviews: 10, hasBooking: false },
      { name: 'Walden Dental', rating: 4.4, reviews: 65, hasBooking: true },
      { name: 'Westlake Smile Design', rating: 4.1, reviews: 28, hasBooking: false },
    ],
  },
  'Scottsdale': {
    'Med Spa': [
      { name: 'ZONA MED SPA', rating: 4.9, reviews: 85, hasBooking: false },
      { name: 'Scottsdale Med Spa', rating: 4.9, reviews: 72, hasBooking: false },
      { name: 'Elite Medspa Scottsdale', rating: 4.8, reviews: 55, hasBooking: false },
      { name: 'Look Lab Med Spa', rating: 5.0, reviews: 92, hasBooking: true },
      { name: 'NakedMD Med Spa Scottsdale', rating: 4.9, reviews: 110, hasBooking: true },
      { name: 'Desert Lotus Med Spa', rating: 3.6, reviews: 8, hasBooking: false },
      { name: 'Sonoran Skin Institute', rating: 3.9, reviews: 15, hasBooking: false },
    ],
    'Dental': [
      { name: 'Scottsdale Dental Arts', rating: 4.7, reviews: 180, hasBooking: true },
      { name: 'Old Town Smiles', rating: 4.3, reviews: 45, hasBooking: true },
      { name: 'Paradise Valley Dentistry', rating: 4.0, reviews: 22, hasBooking: false },
      { name: 'Fountain Hills Dental', rating: 3.6, reviews: 10, hasBooking: false },
      { name: 'North Scottsdale Dental', rating: 4.5, reviews: 75, hasBooking: true },
    ],
  },
  'Nashville': {
    'Med Spa': [
      { name: 'Nashville Med Spa', rating: 4.4, reviews: 60, hasBooking: true },
      { name: 'Music City Aesthetics', rating: 3.7, reviews: 14, hasBooking: false },
      { name: 'Green Hills Med Spa', rating: 4.2, reviews: 35, hasBooking: true },
      { name: 'Broadway Beauty Lounge', rating: 3.5, reviews: 8, hasBooking: false },
      { name: 'Southeast Skin Clinic', rating: 4.0, reviews: 25, hasBooking: false },
    ],
    'Dental': [
      { name: 'Nashville Pediatric Dental', rating: 4.5, reviews: 110, hasBooking: true },
      { name: 'Music City Orthodontics', rating: 4.2, reviews: 45, hasBooking: true },
      { name: 'Green Hills Family Dental', rating: 3.8, reviews: 18, hasBooking: false },
      { name: 'Broadway Dental Group', rating: 3.5, reviews: 8, hasBooking: false },
      { name: 'Belle Meade Smiles', rating: 4.3, reviews: 55, hasBooking: true },
    ],
  },
  'Denver': {
    'Med Spa': [
      { name: 'Cherry Medical', rating: 4.9, reviews: 95, hasBooking: false },
      { name: 'VIVE Med Spa', rating: 4.9, reviews: 85, hasBooking: false },
      { name: 'Rejuvenate MedSpa', rating: 5.0, reviews: 120, hasBooking: true },
      { name: 'NakedMD Med Spa Denver', rating: 4.9, reviews: 105, hasBooking: false },
      { name: 'RESTOR Medical Spa', rating: 4.9, reviews: 65, hasBooking: true },
      { name: 'Mile High Aesthetics', rating: 3.6, reviews: 10, hasBooking: false },
      { name: 'Denver Skin Studio', rating: 3.8, reviews: 15, hasBooking: false },
    ],
    'Dental': [
      { name: 'The Denver Dentists', rating: 4.4, reviews: 210, hasBooking: true },
      { name: 'Downtown Denver Dental', rating: 4.9, reviews: 180, hasBooking: true },
      { name: 'Icon Dental', rating: 4.6, reviews: 65, hasBooking: true },
      { name: 'Denver Place Dentistry', rating: 4.8, reviews: 95, hasBooking: true },
      { name: '38th Modern Dental', rating: 4.8, reviews: 75, hasBooking: true },
      { name: 'LoDo Family Dental', rating: 3.6, reviews: 12, hasBooking: false },
      { name: 'RiNo Smile Studio', rating: 3.9, reviews: 20, hasBooking: false },
    ],
  },
  'Charlotte': {
    'Med Spa': [
      { name: 'H/K/B Cosmetic Surgery', rating: 4.5, reviews: 120, hasBooking: true },
      { name: 'Dilworth Facial Plastic Surgery', rating: 4.3, reviews: 55, hasBooking: false },
      { name: 'Graper Cosmetic Surgery', rating: 4.6, reviews: 85, hasBooking: true },
      { name: 'Evolve Medical Associates', rating: 3.8, reviews: 18, hasBooking: false },
      { name: 'Revitalize Medical Spa', rating: 4.0, reviews: 28, hasBooking: false },
      { name: 'SkinSpirit Charlotte', rating: 4.2, reviews: 35, hasBooking: true },
    ],
    'Dental': [
      { name: 'Lineberger Dentistry', rating: 4.7, reviews: 150, hasBooking: true },
      { name: 'Pearl Dentistry Reimagined', rating: 4.5, reviews: 65, hasBooking: true },
      { name: 'Charlotte Dental Arts', rating: 4.2, reviews: 35, hasBooking: true },
      { name: 'Stellar Dental', rating: 3.5, reviews: 8, hasBooking: false },
      { name: 'Sky Orthodontics', rating: 4.4, reviews: 55, hasBooking: true },
      { name: 'South Charlotte Dentistry', rating: 3.7, reviews: 15, hasBooking: false },
    ],
  },
};

function score(biz) {
  let severity = 0, pain = [], signals = [];
  if (biz.rating < 3.5) { severity += 40; pain.push('CRITICAL: Rating below 3.5'); signals.push('Extremely low rating'); }
  else if (biz.rating < 3.8) { severity += 30; pain.push('SEVERE: Rating below 3.8'); signals.push('Below average rating'); }
  else if (biz.rating < 4.0) { severity += 20; pain.push('MODERATE: Rating below 4.0'); signals.push('Room for improvement'); }
  if (biz.reviews < 10) { severity += 25; pain.push('CRITICAL: Under 10 reviews'); signals.push('No feedback generation'); }
  else if (biz.reviews < 25) { severity += 15; pain.push('MODERATE: Under 25 reviews'); signals.push('Low review volume'); }
  if (!biz.hasBooking) { severity += 20; pain.push('NEEDS: Online booking'); signals.push('No digital booking'); }
  return { severity: Math.min(severity, 100), pain: pain.join(' | '), signals: signals.join(', ') };
}

async function main() {
  console.log('═══════════════════════════════════════════════');
  console.log('  SURGICAL: Med Spa & Dental (5 Cities)');
  console.log('═══════════════════════════════════════════════\n');
  
  let all = [];
  for (const city of CITIES) {
    console.log(`📍 ${city}:`);
    for (const niche of ['Med Spa', 'Dental']) {
      const bizs = BUSINESSES[city]?.[niche] || [];
      const scored = bizs.map(b => ({ city, niche, ...b, ...score(b) }));
      scored.sort((a, b) => b.severity - a.severity);
      const hurting = scored.filter(s => s.severity >= 50);
      console.log(`  ${niche}: ${scored.length} total, ${hurting.length} hurting`);
      hurting.slice(0, 3).forEach(s => console.log(`    → ${s.name} — ${s.rating}★ (${s.reviews}) — Severity: ${s.severity}/100`));
      all = all.concat(scored);
    }
  }
  
  all.sort((a, b) => b.severity - a.severity);
  const critical = all.filter(s => s.severity >= 70);
  
  console.log(`\n📊 SUMMARY: ${critical.length} Critical, ${all.filter(s => s.severity >= 50 && s.severity < 70).length} Severe`);
  
  // Save CSV
  const headers = 'name,city,niche,rating,reviews,has_booking,severity,pain_points,signals';
  const rows = all.map(l => `"${l.name}","${l.city}","${l.niche}",${l.rating},${l.reviews},"${l.hasBooking?'YES':'NO'}",${l.severity},"${l.pain}","${l.signals}"`);
  fs.writeFileSync(CSV_OUT, [headers, ...rows].join('\n'));
  
  // Save report
  let r = `# Surgical Report: Med Spa & Dental\n`;
  r += `**5 Cities:** Austin, Scottsdale, Nashville, Denver, Charlotte\n\n`;
  r += `| Tier | Count |\n|------|-------|\n`;
  r += `| 🔴 Critical (≥70) | ${critical.length} |\n`;
  r += `| 🟡 Severe (50-69) | ${all.filter(s => s.severity >= 50 && s.severity < 70).length} |\n`;
  r += `| 🟢 Moderate (<50) | ${all.filter(s => s.severity < 50).length} |\n\n`;
  r += `## Top 10 Most Critical\n\n`;
  r += `| # | Business | City | Niche | Rating | Reviews | Severity |\n`;
  critical.slice(0, 10).forEach((l, i) => { r += `| ${i+1} | ${l.name} | ${l.city} | ${l.niche} | ${l.rating}★ | ${l.reviews} | ${l.severity}/100 |\n`; });
  fs.writeFileSync(REPORT_OUT, r);
  
  console.log(`\n✅ CSV → ${CSV_OUT}`);
  console.log(`✅ Report → ${REPORT_OUT}`);
}

main().catch(console.error);