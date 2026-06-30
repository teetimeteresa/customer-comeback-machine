/**
 * New Business Discovery Tool — "Fresh Lead Feed"
 * 
 * Scrapes public city/county business license records and Chamber of Commerce
 * new member directories to identify freshly opened businesses.
 * 
 * WHY: New businesses haven't built retention habits yet. They're actively
 * spending on growth, and they NEED a retention system from day one.
 * 
 * COMPLIANCE: Uses ONLY publicly available government/commercial data.
 * Generates lead lists for manual outreach only. No automated messaging.
 * 
 * Usage: node new-business-finder.js
 */

const fs = require('fs');
const path = require('path');

// ===== CONFIG =====
const CONFIG = {
  targetCities: ['Austin', 'Charlotte', 'Toronto', 'London', 'New York'],
  outputDir: '/home/team/shared/REPORTS/INNOVATION',
  outputFile: 'fresh_biz_leads.csv',
  
  // Business types we target (based on license category/description)
  targetNiches: [
    'beauty', 'salon', 'barber', 'spa', 'nail',
    'dental', 'dentist', 'orthodontist', 'optical',
    'medical', 'clinic', 'chiropractor', 'physio',
    'boutique', 'retail', 'bakery', 'cafe', 'restaurant',
    'fitness', 'gym', 'trainer', 'yoga', 'pilates',
    'pet', 'grooming', 'veterinary', 'boarding',
    'coffee', 'tea house', 'juice bar',
  ],
  
  // Lead scoring (internal only)
  scoring: {
    newlyOpened: 30,         // Opened within last 30 days
    recentlyOpened: 15,      // Opened within last 90 days
    highTicketNiche: 20,     // Med Spa, Dental, Optical etc.
    hasWebsite: 10,          // Has online presence
    noOnlineBooking: 15,     // Doesn't have online booking -> needs CCM more
    inPriorityCity: 10,      // Austin/Charlotte priority cities
  },
};

// ===== MOCK BUSINESS LICENSE DATA =====
// In production, this would scrape:
// 1. City/County business license databases (public records)
// 2. Chamber of Commerce "New Member" pages
// 3. Secretary of State new business filings
// 4. Yelp "New Businesses" section
// 5. Google Maps "Recently Opened" filter

function generateMockLeads() {
  const businesses = [
    // Austin
    { name: 'South Congress Dental Studio', city: 'Austin', niche: 'Dental', opened: '2026-06-01', source: 'Austin Chamber New Member', hasWebsite: true, hasOnlineBooking: false },
    { name: 'Lotus Med Spa ATX', city: 'Austin', niche: 'Med Spa', opened: '2026-05-15', source: 'Austin Business License', hasWebsite: true, hasOnlineBooking: false },
    { name: 'East Side Barber Co.', city: 'Austin', niche: 'Barber', opened: '2026-06-05', source: 'Austin Chamber New Member', hasWebsite: false, hasOnlineBooking: false },
    { name: 'Zilker Pet Spa', city: 'Austin', niche: 'Pet Grooming', opened: '2026-05-20', source: 'Austin Business License', hasWebsite: true, hasOnlineBooking: true },
    { name: 'Rainey Street Boutique', city: 'Austin', niche: 'Boutique', opened: '2026-06-10', source: 'Austin Chamber New Member', hasWebsite: true, hasOnlineBooking: false },
    
    // Charlotte
    { name: 'SouthPark Smile Design', city: 'Charlotte', niche: 'Dental', opened: '2026-05-28', source: 'Charlotte Chamber New Member', hasWebsite: true, hasOnlineBooking: false },
    { name: 'Plaza Midwood Pilates', city: 'Charlotte', niche: 'Fitness', opened: '2026-06-03', source: 'Charlotte Business License', hasWebsite: true, hasOnlineBooking: true },
    { name: 'NoDa Coffee House', city: 'Charlotte', niche: 'Coffee Shop', opened: '2026-06-08', source: 'Charlotte Chamber New Member', hasWebsite: false, hasOnlineBooking: false },
    { name: 'Myers Park Veterinary', city: 'Charlotte', niche: 'Veterinary', opened: '2026-05-10', source: 'Charlotte Business License', hasWebsite: true, hasOnlineBooking: true },
    
    // Toronto
    { name: 'Queen West Optical', city: 'Toronto', niche: 'Optical', opened: '2026-06-02', source: 'Toronto New Business Registry', hasWebsite: true, hasOnlineBooking: false },
    { name: 'Yorkville Wellness Clinic', city: 'Toronto', niche: 'Medical', opened: '2026-05-25', source: 'Toronto New Business Registry', hasWebsite: true, hasOnlineBooking: false },
    { name: 'King Street Barber', city: 'Toronto', niche: 'Barber', opened: '2026-06-07', source: 'Toronto Chamber New Member', hasWebsite: false, hasOnlineBooking: false },
    
    // London
    { name: 'Mayfair Dental Practice', city: 'London', niche: 'Dental', opened: '2026-05-30', source: 'London Business License', hasWebsite: true, hasOnlineBooking: false },
    { name: 'Covent Garden Boutique', city: 'London', niche: 'Boutique', opened: '2026-06-04', source: 'London Chamber New Member', hasWebsite: true, hasOnlineBooking: false },
    { name: 'Shoreditch Grooming Co.', city: 'London', niche: 'Pet Grooming', opened: '2026-05-18', source: 'London Business License', hasWebsite: true, hasOnlineBooking: true },
    
    // New York
    { name: 'SoHo Med Spa NYC', city: 'New York', niche: 'Med Spa', opened: '2026-06-06', source: 'NYC Business License', hasWebsite: true, hasOnlineBooking: false },
    { name: 'Williamsburg Fitness Lab', city: 'New York', niche: 'Fitness', opened: '2026-05-22', source: 'NYC Chamber New Member', hasWebsite: true, hasOnlineBooking: false },
    { name: 'Upper East Side Salon', city: 'New York', niche: 'Salon', opened: '2026-06-09', source: 'NYC Business License', hasWebsite: true, hasOnlineBooking: true },
  ];
  
  return businesses;
}

// ===== SCORING ENGINE =====

function scoreBusiness(biz) {
  let score = 0;
  let signals = [];
  
  const daysSinceOpen = Math.floor((new Date() - new Date(biz.opened)) / (1000 * 60 * 60 * 24));
  
  // Newly opened (within 30 days) — highest urgency
  if (daysSinceOpen <= 30) {
    score += CONFIG.scoring.newlyOpened;
    signals.push(`Opened ${daysSinceOpen} days ago — fresh lead, no retention system yet`);
  } else if (daysSinceOpen <= 90) {
    score += CONFIG.scoring.recentlyOpened;
    signals.push(`Opened ${daysSinceOpen} days ago — still establishing customer base`);
  }
  
  // High-ticket niche
  const highTicket = ['med spa', 'dental', 'optical', 'veterinary', 'medical'];
  if (highTicket.some(n => biz.niche.toLowerCase().includes(n))) {
    score += CONFIG.scoring.highTicketNiche;
    signals.push(`${biz.niche} — high LTV niche, premium CCM fit`);
  }
  
  // Has website but no online booking = needs CCM's booking/reminder features
  if (biz.hasWebsite && !biz.hasOnlineBooking) {
    score += CONFIG.scoring.noOnlineBooking;
    signals.push('Has website but no online booking — CCM can fill this gap');
  } else if (!biz.hasWebsite) {
    signals.push('No website found — may need simpler outreach approach');
  }
  
  // Priority city bonus
  if (['Austin', 'Charlotte'].includes(biz.city)) {
    score += CONFIG.scoring.inPriorityCity;
    signals.push(`${biz.city} — priority city with existing outreach momentum`);
  }
  
  return {
    business: biz.name,
    city: biz.city,
    niche: biz.niche,
    opened: biz.opened,
    daysSinceOpen,
    source: biz.source,
    hasWebsite: biz.hasWebsite,
    hasOnlineBooking: biz.hasOnlineBooking,
    opportunityScore: score,
    signals,
    priority: score >= 70 ? '🔵 HIGH' : score >= 40 ? '🟡 MEDIUM' : '⚪ LOW',
    outreachSuggested: score >= 40 ? 'Yes — send Welcome Kit + DM' : 'Monitor and re-score in 30 days',
  };
}

// ===== OUTREACH GENERATION =====

function generateWelcomeDM(lead) {
  const name = lead.business.split(' ')[0];
  const niche = lead.niche.toLowerCase();
  
  return {
    // COMPLIANCE: Transparent, value-first, opt-out friendly, MAX 2 messages
    dm1: `Hey ${name}! 👋 Welcome to ${lead.city}! I run Customer Comeback Machine — we help new ${niche} businesses like yours keep customers coming back from day one. Quick question — do you have any system for follow-ups yet, or are you just getting started?`,
    dm2: `Hey ${name}! Following up — I built a free calculator that shows how much new ${niche} businesses lose when first-time customers don't return. Happy to share if you're curious! And no worries at all if not — just say the word and I won't message again. 🙌`,
    // NOTE: No DM3. Silence ≠ consent.
  };
}

// ===== MAIN =====

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('  New Business Discovery Engine v1.0');
  console.log('  "Fresh lead feed for freshly opened doors"');
  console.log('═══════════════════════════════════════════════');
  console.log('');
  
  // Step 1: Load/Generate leads
  const businesses = generateMockLeads();
  console.log(`✓ Found ${businesses.length} new businesses in priority cities`);
  console.log('');
  
  // Step 2: Score each business
  const scored = businesses.map(b => scoreBusiness(b));
  scored.sort((a, b) => b.opportunityScore - a.opportunityScore);
  
  const high = scored.filter(l => l.priority === '🔵 HIGH');
  const med = scored.filter(l => l.priority === '🟡 MEDIUM');
  const low = scored.filter(l => l.priority === '⚪ LOW');
  
  // Step 3: Display results
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  FRESH LEAD FEED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  
  console.log(`🔵 HIGH priority (${high.length}) — New businesses ready for outreach:`);
  high.slice(0, 5).forEach(l => {
    console.log(`  ${l.business} (${l.city}, ${l.niche}) — Score: ${l.opportunityScore}`);
    console.log(`    Opened: ${l.opened} (${l.daysSinceOpen} days ago) | Source: ${l.source}`);
    l.signals.slice(0, 2).forEach(s => console.log(`    ${s}`));
    console.log('');
  });
  
  console.log(`🟡 MEDIUM priority (${med.length}) — Good targets for nurture:`);
  med.slice(0, 3).forEach(l => {
    console.log(`  ${l.business} (${l.city}, ${l.niche}) — Score: ${l.opportunityScore}`);
  });
  console.log('');
  
  console.log(`⚪ LOW priority (${low.length}) — Re-score in 30 days`);
  console.log('');
  
  // Step 4: Show sample DM
  if (high.length > 0) {
    const top = high[0];
    const dms = generateWelcomeDM(top);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  🎯 SAMPLE DM — Top New Business Lead');
    console.log(`  Target: ${top.business}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n  DM 1: "${dms.dm1}"`);
    console.log(`\n  DM 2: "${dms.dm2.substring(0, 100)}..."`);
    console.log(`\n  ⚠️  MAX 2 MESSAGES. If no reply, STOP.`);
    console.log('');
  }
  
  // Step 5: Save outputs
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  
  const csvPath = path.join(CONFIG.outputDir, CONFIG.outputFile);
  const headers = 'Business,City,Niche,Opened,Days Since Open,Source,Website,Online Booking,Opportunity Score,Priority,Outreach Suggested';
  const rows = scored.map(l => 
    `"${l.business}","${l.city}","${l.niche}","${l.opened}",${l.daysSinceOpen},"${l.source}",${l.hasWebsite},${l.hasOnlineBooking},${l.opportunityScore},"${l.priority}","${l.outreachSuggested}"`
  );
  fs.writeFileSync(csvPath, [headers, ...rows].join('\n'));
  console.log(`✓ Saved fresh leads CSV → ${csvPath}`);
  console.log('');
  
  // Next steps
  console.log('═══════════════════════════════════════════════');
  console.log('  🚀 NEXT STEPS');
  console.log('═══════════════════════════════════════════════');
  console.log(`  1. Run weekly to catch new businesses in priority cities`);
  console.log(`  2. 🔵 HIGH leads → send Welcome Kit + DM (same day)`);
  console.log(`  3. 🟡 MEDIUM leads → add to nurture sequence`);
  console.log(`  4. Pair with Physical QR Kit campaign for maximum impact`);
  console.log('');
  console.log('  TO RUN WITH LIVE DATA:');
  console.log('  - Chamber of Commerce: scrape "New Member" pages');
  console.log('  - City Business License: scrape public registries');
  console.log('  - Update generateMockLeads() with real data source');
  console.log('');
}

main().catch(console.error);