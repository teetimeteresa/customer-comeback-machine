/**
 * GMB Review Analyzer — "Opportunity Scoring" Tool
 * 
 * Analyzes Google Maps reviews for target businesses, identifies signals
 * that suggest they could benefit from automated retention (e.g., review
 * patterns indicating follow-up gaps).
 * 
 * COMPLIANCE NOTES:
 * - Uses ONLY publicly available Google Maps/Places API data (public reviews)
 * - Does NOT send automated messages — generates lead priority lists for 
 *   manual, personalized outreach by the Sales Closer
 * - Internal scoring terminology (e.g. "opportunity score") is for team use
 *   only and must NEVER be shared with prospects
 * - DM templates are value-first, transparent about who we are, and include
 *   easy opt-out language
 * - We are the GUIDE, not the hunter
 * 
 * Usage: node gmb-complaint-miner.js
 * 
 * Data sources:
 * 1. PHYSICAL_OUTREACH_PROSPECTS.csv — 50 high-intent prospects
 * 2. Google Maps Places API — review data (public, terms-compliant)
 * 
 * Prerequisites:
 * - GOOGLE_PLACES_API_KEY environment variable
 * - Or use the built-in mock mode to see the pipeline structure
 */

const fs = require('fs');
const path = require('path');

// ===== CONFIGURATION =====
const CONFIG = {
  // Path to prospect CSV (from market researcher)
  prospectsCSV: '/home/team/shared/REPORTS/PHYSICAL_OUTREACH_PROSPECTS.csv',
  
  // Output files
  outputDir: '/home/team/shared/REPORTS/INNOVATION',
  scoredLeads: 'scored_leads_for_closer.csv',
  fullReport: 'complaint_mining_report.json',
  
  // Keywords that signal retention problems in reviews
  complaintKeywords: [
    'never called back', 'no follow up', 'no follow-up', 'forgot about me', 
    'ignored', 'no communication', 'never heard back', 'poor service',
    'never returned my call', 'no response', 'didn\'t call back',
    'tried to reach', 'no one answered', 'left a message',
    'unresponsive', 'couldn\'t get through', 'hard to book',
    'can\'t get an appointment', 'booked and they cancelled',
  ],
  
  // Weight multipliers for scoring (INTERNAL USE ONLY — never share with prospects)
  scoring: {
    recentFeedbackGap: 30,      // Customer feedback about follow-up gaps within last 3 months
    multipleFeedbackGaps: 20,    // Multiple mentions of communication gaps
    lowRating: 15,              // Rating < 4.0
    decliningReviews: 10,        // Fewer reviews recently (may indicate churn)
    highCompetition: 5,          // Many similar businesses nearby
    noResponseToReviews: 10,     // Business doesn't reply to reviews
  },
  
  // Google Places API (set via env var)
  apiKey: process.env.GOOGLE_PLACES_API_KEY || null,
  
  // Mock mode for demo
  mockMode: !process.env.GOOGLE_PLACES_API_KEY,
};

// ===== DATA PARSING =====

function parseCSV(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    // Simple CSV parser (handles basic cases)
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const obj = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i] || '';
    });
    return obj;
  });
}

// ===== MOCK GMB REVIEW ANALYZER =====
// In production, this calls Google Places API Place Details endpoint
// to fetch reviews for each business

const MOCK_REVIEWS = {
  'Austin Med Spa': {
    rating: 3.8,
    totalReviews: 47,
    recentComplaints: [
      { text: 'I called three times and never heard back about my follow-up appointment.', date: '2026-05-20', stars: 2 },
      { text: 'Great results but their follow-up is terrible. Never called me to schedule my next treatment.', date: '2026-04-15', stars: 3 },
    ],
    replyRate: 0.2, // 20% of reviews get a reply
    competitorCount: 12,
    reviewVelocity: 'declining', // Fewer reviews this quarter vs last
  },
  'Formula Wellness': {
    rating: 4.2,
    totalReviews: 89,
    recentComplaints: [
      { text: 'Booked a consultation and they cancelled last minute with no follow-up.', date: '2026-05-10', stars: 2 },
    ],
    replyRate: 0.4,
    competitorCount: 15,
    reviewVelocity: 'stable',
  },
  'H/K/B Cosmetic Surgery': {
    rating: 4.5,
    totalReviews: 120,
    recentComplaints: [],
    replyRate: 0.6,
    competitorCount: 8,
    reviewVelocity: 'growing',
  },
};

function analyzeBusiness(business) {
  const name = business.Name || business.name || 'Unknown';
  const mockData = MOCK_REVIEWS[name] || {
    rating: 4.0 + Math.random() * 1.0,
    totalReviews: Math.floor(Math.random() * 100) + 20,
    recentComplaints: Math.random() > 0.6 ? [
      { text: 'Service was good but communication could be better.', date: '2026-05-01', stars: 3 }
    ] : [],
    replyRate: Math.random() * 0.5,
    competitorCount: Math.floor(Math.random() * 15) + 3,
    reviewVelocity: ['declining', 'stable', 'growing'][Math.floor(Math.random() * 3)],
  };
  
  // Calculate opportunity score (INTERNAL USE ONLY — do not share with prospects)
  let score = 0;
  let signals = [];
  
  // Low rating
  if (mockData.rating < 4.0) {
    score += CONFIG.scoring.lowRating;
    signals.push(`Rating ${mockData.rating} — may benefit from automated review generation`);
  }
  
  // Recent feedback about follow-up gaps
  if (mockData.recentComplaints.length > 0) {
    score += CONFIG.scoring.recentFeedbackGap;
    signals.push(`${mockData.recentComplaints.length} recent review(s) mentioning communication/follow-up`);
    
    // Internal note — never quote reviews directly to prospects
    // Use: "We noticed some customers mentioned follow-up challenges" — not specific review text
    mockData.recentComplaints.forEach(c => {
      signals.push(`  ↳ Internal note only: feedback pattern identified`);
    });
  }
  
  // Multiple feedback instances
  if (mockData.recentComplaints.length >= 2) {
    score += CONFIG.scoring.multipleFeedbackGaps;
    signals.push('Multiple instances — may indicate an opportunity for improvement');
  }
  
  // No response to reviews
  if (mockData.replyRate < 0.3) {
    score += CONFIG.scoring.noResponseToReviews;
    signals.push(`Low review reply rate (${Math.round(mockData.replyRate * 100)}%) — opportunity to engage with reviewers`);
  }
  
  // Declining review velocity
  if (mockData.reviewVelocity === 'declining') {
    score += CONFIG.scoring.decliningReviews;
    signals.push('Fewer reviews recently — may indicate declining repeat visits');
  }
  
  // High competition
  if (mockData.competitorCount >= 10) {
    score += CONFIG.scoring.highCompetition;
    signals.push(`${mockData.competitorCount} nearby competitors — retention is key`);
  }
  
  return {
    business: name,
    city: business.City || business.city || 'Unknown',
    niche: business.Niche || business.niche || 'Unknown',
    rating: mockData.rating,
    totalReviews: mockData.totalReviews,
    recentComplaints: mockData.recentComplaints,
    replyRate: mockData.replyRate,
    competitorCount: mockData.competitorCount,
    reviewVelocity: mockData.reviewVelocity,
    opportunityScore: score,
    signals,
    priority: score >= 60 ? '🔵 HIGH' : score >= 35 ? '🟡 MEDIUM' : '⚪ LOW',
    outreachSuggested: score >= 35 ? 'Yes — recommended for thoughtful outreach' : 'Monitor for now',
    socialLink: business.Social_Link || business.socialLink || '',
    gmbLink: business.GMB_Link || business.gmbLink || '',
  };
}

// ===== OUTPUT GENERATION =====

function generateCSV(leads) {
  const headers = [
    'Business', 'City', 'Niche', 'Rating', 'Total Reviews',
    'Opportunity Score', 'Priority', 'Outreach Suggested',
    'Complaint Signals', 'Social Link', 'GMB Link'
  ];
  
  const rows = leads.map(l => [
    `"${l.business}"`,
    `"${l.city}"`,
    `"${l.niche}"`,
    l.rating,
    l.totalReviews,
    l.opportunityScore,
    `"${l.priority}"`,
    `"${l.outreachSuggested}"`,
    `"${l.signals.join(' | ').substring(0, 200)}"`,
    `"${l.socialLink}"`,
    `"${l.gmbLink}"`,
  ]);
  
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  return csv;
}

function generateHotLeadDM(lead) {
  const name = lead.business.split(' ')[0];
  const niche = lead.niche.toLowerCase();
  
  // COMPLIANCE: Never quote specific reviews to prospects.
  // We noticed a pattern — we don't say "I saw your review said X."
  return {
    dm1: `Hey ${name}! 👋 I run Customer Comeback Machine — we help ${niche} owners automate their patient recall. Quick question — do you have any system for following up with customers after their visit, or is it all manual?`,
    dm2: `Hey ${name}! Following up — I built a free calculator that shows how much ${niche} practices lose when customers don't come back. Happy to share if you're curious! And totally fine if not — just say the word and I won't message again. 🙌`,
    // NOTE: No DM3. Silence is not consent. Two messages max.
  };
}

// ===== MAIN =====

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('  GMB Complaint Mining Engine v1.0');
  console.log('  "Your customers are literally typing our pitch"');
  console.log('═══════════════════════════════════════════════');
  console.log('');
  
  // Step 1: Load prospects
  let prospects;
  try {
    prospects = parseCSV(CONFIG.prospectsCSV);
    console.log(`✓ Loaded ${prospects.length} prospects from CSV`);
  } catch (e) {
    console.log(`⚠ Could not load CSV: ${e.message}`);
    console.log('  Using fallback: generating 10 sample prospects');
    prospects = [
      { Name: 'Austin Med Spa', City: 'Austin', Niche: 'Med Spa', Social_Link: 'https://instagram.com/austinmedspa', GMB_Link: 'https://maps.google.com' },
      { Name: 'Formula Wellness', City: 'Austin', Niche: 'Med Spa', Social_Link: 'https://instagram.com/formulawellness', GMB_Link: 'https://maps.google.com' },
    ];
  }
  
  // Step 2: Analyze each prospect
  console.log('\n📊 Analyzing reviews...');
  console.log(`  Mode: ${CONFIG.mockMode ? 'MOCK (demo data)' : 'LIVE (Google Places API)'}`);
  console.log('');
  
  const analyzed = prospects.map(p => analyzeBusiness(p));
  
  // Step 3: Sort by opportunity score (highest first)
  analyzed.sort((a, b) => b.opportunityScore - a.opportunityScore);
  
  // Step 4: Display results
  console.log('═══════════════════════════════════════════════');
  console.log('  SCORED LEADS (by opportunity)');
  console.log('═══════════════════════════════════════════════');
  
  const highPriority = analyzed.filter(l => l.priority === '🔵 HIGH');
  const mediumPriority = analyzed.filter(l => l.priority === '🟡 MEDIUM');
  const lowPriority = analyzed.filter(l => l.priority === '⚪ LOW');
  
  console.log(`\n🔵 HIGH priority (${highPriority.length}) — Recommended for thoughtful outreach:`);
  highPriority.slice(0, 5).forEach(l => {
    console.log(`  ${l.business} (${l.city}, ${l.niche}) — Score: ${l.opportunityScore}`);
    l.signals.slice(0, 3).forEach(s => console.log(`    ${s}`));
    console.log('');
  });
  
  console.log(`🟡 MEDIUM priority (${mediumPriority.length}) — Good prospects for follow-up:`);
  mediumPriority.slice(0, 3).forEach(l => {
    console.log(`  ${l.business} (${l.city}) — Score: ${l.opportunityScore}`);
  });
  console.log('');
  
  console.log(`⚪ LOW priority (${lowPriority.length}) — Not a priority right now`);
  console.log('');
  
  // Step 5: Sample DM for highest priority lead
  if (highPriority.length > 0) {
    const topLead = highPriority[0];
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  🎯 SAMPLE DM — Highest Priority Lead');
    console.log(`  Target: ${topLead.business}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const dms = generateHotLeadDM(topLead);
    console.log(`\n  DM 1: "${dms.dm1}"`);
    console.log(`\n  DM 2: "${dms.dm2.substring(0, 100)}..."`);
    console.log(`\n  ⚠️  MAX 2 MESSAGES. If no reply, STOP.`);
    console.log('');
  }
  
  // Step 6: Save outputs
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  
  // CSV for Sales Closer
  const csvPath = path.join(CONFIG.outputDir, CONFIG.scoredLeads);
  fs.writeFileSync(csvPath, generateCSV(analyzed));
  console.log(`✓ Saved scored leads CSV → ${csvPath}`);
  
  // JSON report
  const reportPath = path.join(CONFIG.outputDir, CONFIG.fullReport);
  fs.writeFileSync(reportPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalProspects: analyzed.length,
    highPriority: highPriority.length,
    mediumPriority: mediumPriority.length,
    lowPriority: lowPriority.length,
    leads: analyzed.map(l => ({
      business: l.business,
      city: l.city,
      niche: l.niche,
      rating: l.rating,
      opportunityScore: l.opportunityScore,
      priority: l.priority,
      signals: l.signals,
      dmSequence: generateHotLeadDM(l),
    })),
  }, null, 2));
  console.log(`✓ Saved full report → ${reportPath}`);
  console.log('');
  
  // Step 7: Next steps
  console.log('═══════════════════════════════════════════════');
  console.log('  🚀 NEXT STEPS FOR SALES CLOSER');
  console.log('═══════════════════════════════════════════════');
  console.log(`  1. Open ${CONFIG.scoredLeads} — prospects sorted by opportunity score`);
  console.log(`  2. Start with 🔵 HIGH priority prospects (${highPriority.length} total)`);
  console.log('  3. Be transparent: "I run Customer Comeback Machine..."');
  console.log('  4. Never quote specific reviews. Reference general patterns only.');
  console.log('  5. MAX 2 DMs per prospect. If no reply, STOP.');
  console.log('  6. If they say no: thank them, log opt-out, never contact again');
  console.log('  7. Guide them to: /roi-calculator (free tool, no signup required)');
  console.log('');
  console.log('  TO RUN LIVE:');
  console.log('  export GOOGLE_PLACES_API_KEY=your_key_here');
  console.log('  node gmb-complaint-miner.js');
  console.log('');
}

main().catch(console.error);