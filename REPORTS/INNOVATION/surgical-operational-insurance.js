/**
 * Surgical "Operational Insurance" Lead Targeting
 * 
 * Goes deep on businesses already identified as "hurting"
 * with low ratings, few reviews, and no booking system.
 * 
 * These are CCM's BEST prospects — they need retention
 * automation immediately.
 */

const fs = require('fs');
const { spawnSync } = require('child_process');

const CSV_IN = '/home/team/shared/REPORTS/INNOVATION/high_intent_opportunity_leads.csv';
const CSV_OUT = '/home/team/shared/REPORTS/INNOVATION/surgical_hurting_leads.csv';
const REPORT_OUT = '/home/team/shared/REPORTS/INNOVATION/surgical_report.md';

// Read scored leads
const content = fs.readFileSync(CSV_IN, 'utf-8');
const lines = content.trim().split('\n');
const headers = lines[0].split(',');
const leads = lines.slice(1).map(line => {
    const vals = [];
    let cur = '', inQ = false;
    for (const c of line) {
        if (c === '"') inQ = !inQ;
        else if (c === ',' && !inQ) { vals.push(cur.trim()); cur = ''; }
        else cur += c;
    }
    vals.push(cur.trim());
    const obj = {};
    headers.forEach((h, i) => { obj[h.trim()] = vals[i] || ''; });
    return obj;
});

// Filter to HIGH priority only
const highPriority = leads.filter(l => l.priority && l.priority.includes('HIGH'));

// Score by "hurt severity"
function calcHurtSeverity(lead) {
    const rating = parseFloat(lead.rating ? lead.rating.replace(/"/g, '') : 5);
    const reviews = parseInt(lead.reviews ? lead.reviews.replace(/"/g, '') : 0);
    const signals = (lead.signals || '').replace(/"/g, '');
    const hasBooking = (lead.has_booking || '').replace(/"/g, '');
    
    let severity = 0;
    let painPoints = [];
    
    // Low rating = hurting
    if (rating < 3.5) { severity += 40; painPoints.push('CRITICAL: Rating below 3.5'); }
    else if (rating < 3.8) { severity += 30; painPoints.push('SEVERE: Rating below 3.8'); }
    else if (rating < 4.0) { severity += 20; painPoints.push('MODERATE: Rating below 4.0'); }
    
    // Very few reviews = not generating feedback = churn
    if (reviews < 20) { severity += 25; painPoints.push('CRITICAL: Under 20 reviews'); }
    else if (reviews < 35) { severity += 15; painPoints.push('MODERATE: Under 35 reviews'); }
    
    // No booking = needs automation
    if (hasBooking === 'NO' || hasBooking === 'N') { severity += 20; painPoints.push('NEEDS: Online booking system'); }
    
    return { severity: Math.min(severity, 100), painPoints };
}

// Build surgical report
let report = `# Surgical "Operational Insurance" Lead Report
**Generated:** ${new Date().toISOString()}
**Focus:** Businesses actively "hurting" from churn signals

---

## 🔴 CRITICAL Leads (Need CCM Today)

These businesses have the clearest signs of customer churn:
- Low ratings (< 4.0★)
- Few reviews (< 30)
- No online booking system

`;

const enriched = highPriority.map(l => {
    const s = calcHurtSeverity(l);
    return { ...l, severity: s.severity, painPoints: s.painPoints };
}).sort((a, b) => b.severity - a.severity);

// Group by severity tier
const critical = enriched.filter(l => l.severity >= 70);
const severe = enriched.filter(l => l.severity >= 50 && l.severity < 70);
const moderate = enriched.filter(l => l.severity < 50);

report += `### Top 10 Most "Hurting" Businesses\n\n`;
report += `| # | Business | City | Niche | Rating | Reviews | Booking | Severity |\n`;
report += `|---|----------|------|-------|--------|---------|---------|----------|\n`;
enriched.slice(0, 10).forEach((l, i) => {
    const name = l.business.replace(/"/g, '');
    const city = l.city.replace(/"/g, '');
    const niche = l.niche.replace(/"/g, '');
    report += `| ${i+1} | ${name} | ${city} | ${niche} | ${l.rating}★ | ${l.reviews} | ${l.has_booking} | ${l.severity}/100 |\n`;
});

report += `\n### Pain Point Breakdown\n\n`;
const uniqueNiches = [...new Set(enriched.map(l => (l.niche || '').replace(/"/g, '')))];
for (const niche of uniqueNiches) {
    const nicheLeads = enriched.filter(l => (l.niche || '').replace(/"/g, '') === niche);
    const avgRating = nicheLeads.reduce((s, l) => s + parseFloat(l.rating || 0), 0) / nicheLeads.length;
    const avgReviews = nicheLeads.reduce((s, l) => s + parseInt(l.reviews || 0), 0) / nicheLeads.length;
    const worst = nicheLeads.sort((a,b) => parseFloat(a.rating || 5) - parseFloat(b.rating || 5))[0];
    report += `**${niche}** (${nicheLeads.length} hurting leads)\n`;
    report += `- Avg rating: ${avgRating.toFixed(1)}★ | Avg reviews: ${Math.round(avgReviews)}\n`;
    report += `- Worst: ${(worst?.business || '').replace(/"/g,'')} (${Math.min(...nicheLeads.map(l => parseFloat(l.rating || 5)))}★)\n\n`;
}

report += `## 🎯 Surgical Outreach Recommendations\n\n`;
report += `**For the Sales Closer:**\n`;
report += `1. Contact the TOP 5 critical leads TODAY\n`;
report += `2. Lead with: "I noticed your business has great potential but your online presence doesn't reflect it"\n`;
report += `3. Offer: Free 14-day trial of CCM (no credit card)\n`;
report += `4. Show them the ROI calculator: /roi-calculator\n`;
report += `5. Position CCM as: "Operational Insurance" — protects against customer drift\n\n`;

report += `### Top 5 Immediate Targets\n\n`;
enriched.slice(0, 5).forEach((l, i) => {
    const name = l.business.replace(/"/g, '');
    report += `**${i+1}. ${name}** (${l.city.replace(/"/g,'')}, ${l.niche.replace(/"/g,'')})\n`;
    report += `- ${l.rating.replace(/"/g,'')}★ — Only ${l.reviews} reviews — No booking\n`;
    report += `- DM opener: "Hey! I run Customer Comeback Machine — we help ${l.niche.replace(/"/g,'').toLowerCase()} businesses in ${l.city.replace(/"/g,'')} stop losing customers. Quick question — do you use any automated system for follow-ups?"\n\n`;
});

fs.writeFileSync(REPORT_OUT, report);

// Save enriched CSV
const newHeaders = [...headers, 'hurt_severity', 'pain_points'];
const rows = enriched.map(l => {
    const vals = headers.map(h => l[h] || '');
    vals.push(l.severity.toString());
    vals.push(`"${l.painPoints.join(' | ')}"`);
    return vals.join(',');
});
fs.writeFileSync(CSV_OUT, [newHeaders.join(','), ...rows].join('\n'));

console.log('═══════════════════════════════════════════════');
console.log('  SURGICAL "OPERATIONAL INSURANCE" REPORT');
console.log('═══════════════════════════════════════════════');
console.log(`\n🔴 CRITICAL (severity ≥ 70): ${critical.length} leads`);
console.log(`🟡 SEVERE (severity 50-69): ${severe.length} leads`);
console.log(`🟢 MODERATE (severity < 50): ${moderate.length} leads`);
console.log(`\n🏆 TOP 5 HURTING BUSINESSES (contact TODAY):`);
enriched.slice(0, 5).forEach((l, i) => {
    console.log(`  ${i+1}. ${l.business.replace(/"/g,'')} (${l.city.replace(/"/g,'')}, ${l.niche.replace(/"/g,'')}) — ${l.rating}★ — Severity: ${l.severity}/100`);
    l.painPoints.forEach(p => console.log(`     • ${p}`));
});
console.log(`\n✅ CSV saved → ${CSV_OUT}`);
console.log(`✅ Report saved → ${REPORT_OUT}`);
console.log(`\n🚀 Give these to the Sales Closer NOW!`);