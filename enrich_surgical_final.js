#!/usr/bin/env node
/**
 * Final enrichment script - generates the enriched CSV with verification status
 * and Instagram/LinkedIn social profiles for the Surgical 49 leads.
 * 
 * Focuses on SEVERE and CRITICAL leads first for the DM wave.
 * Domain verification results are incorporated.
 */

const fs = require('fs');

// Verified domain status (from curl checks)
const domainStatus = {
  'musiccityautorepair.com': 'LIVE (405)',
  'pawpleasersgrooming.com': 'NO_DOMAIN',
  'vibeyogastudio.com': 'LIVE (301)',
  'pridegroomscottsdale.com': 'NO_DOMAIN',
  'elitefinishauto.com': 'NO_DOMAIN',
  'culversautobody.com': 'NO_DOMAIN',
  'scottdaleautorepair.com': 'NO_DOMAIN',
  'eliteautowerks.com': 'LIVE (200)',
  'denverdoggrooming.com': 'LIVE (405)',
  'coloradoautorepair.com': 'LIVE (200)',
  'autowerkscharlotte.com': 'NO_DOMAIN',
  'austindetailingspeci.com': 'UNCHECKED',
  'radiantyogaaustin.com': 'NO_DOMAIN',
  'thebakeryatscottsdal.com': 'UNCHECKED',
  'pawsitivelygroomed.com': 'UNCHECKED',
  'iveycakebakery.com': 'UNCHECKED',
  'yogatreenashville.com': 'UNCHECKED',
  'pawworksdenver.com': 'UNCHECKED',
  'villanisgourmetbaker.com': 'UNCHECKED',
  'superiorautobodyaust.com': 'UNCHECKED',
  'texasfrenchbread.com': 'LIVE (200)',
  'sundevilautoscottsda.com': 'UNCHECKED',
  'truehotyoga.com': 'LIVE (301)',
  'exoticmotorsdenver.com': 'UNCHECKED',
  'samadhiyoga.com': 'LIVE (200)',
  'superiorautocharlott.com': 'UNCHECKED',
  'riveryogadenver.com': 'UNCHECKED',
  'jldesserts.com': 'NO_DOMAIN',
  'echocoffee.com': 'LIVE (301)',
  'theyogaroom.com': 'UNCHECKED',
  'woofsdoggrooming.com': 'UNCHECKED',
  'bakedon8th.com': 'UNCHECKED',
  'nashvillepoweryoga.com': 'UNCHECKED',
  'aussiepetmobiledenve.com': 'UNCHECKED',
  'gratefulbreadbakery.com': 'UNCHECKED',
  'woofgangbakerycharlo.com': 'UNCHECKED',
  'queencitygrounds.com': 'UNCHECKED',
  'studio108yoga.com': 'UNCHECKED',
  'bluelotusyoga.com': 'UNCHECKED',
  'barkavenuescottsdale.com': 'UNCHECKED',
  'bongojava.com': 'LIVE (301)',
  'siftbakeshop.com': 'LIVE (301)',
  'dessertsbyhelen.com': 'UNCHECKED',
  'suarezbakery.com': 'UNCHECKED',
  'thedetailshopaustin.com': 'UNCHECKED',
  'dharmayogaaustin.com': 'UNCHECKED',
  'thedetailshopnashvil.com': 'UNCHECKED',
  'thedetailingcompany.com': 'UNCHECKED',
  'thedetailshopcharlot.com': 'UNCHECKED',
};

// All 49 leads with social handle guesses
const allLeads = [
  // ===== CRITICAL =====
  { business: "Music City Auto Repair", city: "Nashville", niche: "Auto", email: "info@musiccityautorepair.com", severity: "CRITICAL", rating: "3.4", reviews: "210", hasBooking: "NO", score: "100" },
  
  // ===== SEVERE =====
  { business: "Paw Pleasers Grooming", city: "Charlotte", niche: "Pet", email: "hello@pawpleasersgrooming.com", severity: "SEVERE", rating: "3.6", reviews: "18", hasBooking: "NO", score: "100" },
  { business: "Vibe Yoga Studio", city: "Charlotte", niche: "Yoga", email: "flow@vibeyogastudio.com", severity: "SEVERE", rating: "3.6", reviews: "18", hasBooking: "NO", score: "100" },
  { business: "Pride & Groom Scottsdale", city: "Scottsdale", niche: "Pet", email: "hello@pridegroomscottsdale.com", severity: "SEVERE", rating: "3.7", reviews: "22", hasBooking: "NO", score: "100" },
  { business: "Elite Finish Auto", city: "Denver", niche: "Auto", email: "info@elitefinishauto.com", severity: "SEVERE", rating: "3.7", reviews: "25", hasBooking: "NO", score: "100" },
  { business: "Culvers Auto Body", city: "Scottsdale", niche: "Auto", email: "info@culversautobody.com", severity: "SEVERE", rating: "3.6", reviews: "180", hasBooking: "NO", score: "100" },
  { business: "Scottdale Auto Repair", city: "Scottsdale", niche: "Auto", email: "info@scottdaleautorepair.com", severity: "SEVERE", rating: "3.5", reviews: "120", hasBooking: "NO", score: "100" },
  { business: "Elite Auto Werks", city: "Nashville", niche: "Auto", email: "info@eliteautowerks.com", severity: "SEVERE", rating: "3.7", reviews: "85", hasBooking: "NO", score: "100" },
  { business: "Denver Dog Grooming", city: "Denver", niche: "Pet", email: "hello@denverdoggrooming.com", severity: "SEVERE", rating: "3.6", reviews: "42", hasBooking: "NO", score: "100" },
  { business: "Colorado Auto Repair", city: "Denver", niche: "Auto", email: "info@coloradoautorepair.com", severity: "SEVERE", rating: "3.5", reviews: "180", hasBooking: "NO", score: "100" },
  { business: "AutoWerks Charlotte", city: "Charlotte", niche: "Auto", email: "info@autowerkscharlotte.com", severity: "SEVERE", rating: "3.5", reviews: "85", hasBooking: "NO", score: "100" },

  // ===== MODERATE =====
  { business: "Austin Detailing Specialists", city: "Austin", niche: "Auto", email: "info@austindetailingspeci.com", severity: "MODERATE", rating: "3.9", reviews: "32", hasBooking: "NO", score: "100" },
  { business: "Radiant Yoga Austin", city: "Austin", niche: "Yoga", email: "flow@radiantyogaaustin.com", severity: "MODERATE", rating: "3.8", reviews: "28", hasBooking: "NO", score: "100" },
  { business: "The Bakery At Scottsdale", city: "Scottsdale", niche: "Bakery", email: "sweet@thebakeryatscottsdal.com", severity: "MODERATE", rating: "3.8", reviews: "28", hasBooking: "NO", score: "100" },
  { business: "Pawsitively Groomed", city: "Nashville", niche: "Pet", email: "hello@pawsitivelygroomed.com", severity: "MODERATE", rating: "3.8", reviews: "25", hasBooking: "NO", score: "100" },
  { business: "Ivey Cake Bakery", city: "Nashville", niche: "Bakery", email: "sweet@iveycakebakery.com", severity: "MODERATE", rating: "3.9", reviews: "22", hasBooking: "NO", score: "100" },
  { business: "Yoga Tree Nashville", city: "Nashville", niche: "Yoga", email: "flow@yogatreenashville.com", severity: "MODERATE", rating: "3.8", reviews: "30", hasBooking: "NO", score: "100" },
  { business: "Paw Works Denver", city: "Denver", niche: "Pet", email: "hello@pawworksdenver.com", severity: "MODERATE", rating: "3.9", reviews: "28", hasBooking: "NO", score: "100" },
  { business: "Villanis Gourmet Bakery", city: "Charlotte", niche: "Bakery", email: "sweet@villanisgourmetbaker.com", severity: "MODERATE", rating: "3.8", reviews: "28", hasBooking: "NO", score: "100" },
  { business: "Superior Auto Body Austin", city: "Austin", niche: "Auto", email: "info@superiorautobodyaust.com", severity: "MODERATE", rating: "3.8", reviews: "210", hasBooking: "NO", score: "100" },
  { business: "Texas French Bread", city: "Austin", niche: "Bakery", email: "sweet@texasfrenchbread.com", severity: "MODERATE", rating: "3.9", reviews: "45", hasBooking: "NO", score: "100" },
  { business: "Sun Devil Auto Scottsdale", city: "Scottsdale", niche: "Auto", email: "info@sundevilautoscottsda.com", severity: "MODERATE", rating: "3.9", reviews: "68", hasBooking: "NO", score: "100" },
  { business: "True Hot Yoga", city: "Scottsdale", niche: "Yoga", email: "flow@truehotyoga.com", severity: "MODERATE", rating: "3.9", reviews: "45", hasBooking: "NO", score: "100" },
  { business: "Exotic Motors Denver", city: "Denver", niche: "Auto", email: "info@exoticmotorsdenver.com", severity: "MODERATE", rating: "3.8", reviews: "120", hasBooking: "NO", score: "100" },
  { business: "Samadhi Yoga", city: "Denver", niche: "Yoga", email: "flow@samadhiyoga.com", severity: "MODERATE", rating: "3.9", reviews: "35", hasBooking: "NO", score: "100" },
  { business: "Superior Auto Charlotte", city: "Charlotte", niche: "Auto", email: "info@superiorautocharlott.com", severity: "MODERATE", rating: "3.8", reviews: "150", hasBooking: "NO", score: "100" },
  { business: "River Yoga Denver", city: "Denver", niche: "Yoga", email: "flow@riveryogadenver.com", severity: "MODERATE", rating: "4.1", reviews: "28", hasBooking: "NO", score: "95" },
  { business: "JL Desserts", city: "Scottsdale", niche: "Bakery", email: "sweet@jldesserts.com", severity: "MODERATE", rating: "4.1", reviews: "32", hasBooking: "NO", score: "85" },

  // ===== LOW =====
  { business: "Echo Coffee", city: "Scottsdale", niche: "Coffee", email: "brew@echocoffee.com", severity: "LOW", rating: "4.1", reviews: "42", hasBooking: "NO", score: "85" },
  { business: "The Yoga Room", city: "Scottsdale", niche: "Yoga", email: "flow@theyogaroom.com", severity: "LOW", rating: "4.2", reviews: "38", hasBooking: "NO", score: "85" },
  { business: "Woofs Dog Grooming", city: "Nashville", niche: "Pet", email: "hello@woofsdoggrooming.com", severity: "LOW", rating: "4.1", reviews: "55", hasBooking: "NO", score: "85" },
  { business: "Baked on 8th", city: "Nashville", niche: "Bakery", email: "sweet@bakedon8th.com", severity: "LOW", rating: "4", reviews: "38", hasBooking: "NO", score: "85" },
  { business: "Nashville Power Yoga", city: "Nashville", niche: "Yoga", email: "flow@nashvillepoweryoga.com", severity: "LOW", rating: "4.1", reviews: "45", hasBooking: "NO", score: "85" },
  { business: "Aussie Pet Mobile Denver", city: "Denver", niche: "Pet", email: "hello@aussiepetmobiledenve.com", severity: "LOW", rating: "4.1", reviews: "35", hasBooking: "NO", score: "85" },
  { business: "Grateful Bread Bakery", city: "Denver", niche: "Bakery", email: "sweet@gratefulbreadbakery.com", severity: "LOW", rating: "4.1", reviews: "55", hasBooking: "NO", score: "85" },
  { business: "Woof Gang Bakery Charlotte", city: "Charlotte", niche: "Pet", email: "hello@woofgangbakerycharlo.com", severity: "LOW", rating: "4.2", reviews: "55", hasBooking: "NO", score: "85" },
  { business: "Queen City Grounds", city: "Charlotte", niche: "Coffee", email: "brew@queencitygrounds.com", severity: "LOW", rating: "4.1", reviews: "42", hasBooking: "NO", score: "85" },
  { business: "Studio 108 Yoga", city: "Charlotte", niche: "Yoga", email: "flow@studio108yoga.com", severity: "LOW", rating: "4.1", reviews: "35", hasBooking: "NO", score: "85" },
  { business: "Blue Lotus Yoga", city: "Charlotte", niche: "Yoga", email: "flow@bluelotusyoga.com", severity: "LOW", rating: "4.2", reviews: "42", hasBooking: "NO", score: "85" },
  { business: "Bark Avenue Scottsdale", city: "Scottsdale", niche: "Pet", email: "hello@barkavenuescottsdale.com", severity: "LOW", rating: "4.2", reviews: "65", hasBooking: "NO", score: "75" },
  { business: "Bongo Java", city: "Nashville", niche: "Coffee", email: "brew@bongojava.com", severity: "LOW", rating: "4.1", reviews: "120", hasBooking: "NO", score: "75" },
  { business: "Sift Bake Shop", city: "Nashville", niche: "Bakery", email: "sweet@siftbakeshop.com", severity: "LOW", rating: "4.3", reviews: "52", hasBooking: "NO", score: "75" },
  { business: "Desserts By Helen", city: "Denver", niche: "Bakery", email: "sweet@dessertsbyhelen.com", severity: "LOW", rating: "4.3", reviews: "42", hasBooking: "NO", score: "75" },
  { business: "Suarez Bakery", city: "Charlotte", niche: "Bakery", email: "sweet@suarezbakery.com", severity: "LOW", rating: "4.4", reviews: "42", hasBooking: "NO", score: "75" },
  { business: "The Detail Shop Austin", city: "Austin", niche: "Auto", email: "info@thedetailshopaustin.com", severity: "LOW", rating: "4.2", reviews: "45", hasBooking: "YES", score: "70" },
  { business: "Dharma Yoga Austin", city: "Austin", niche: "Yoga", email: "flow@dharmayogaaustin.com", severity: "LOW", rating: "4.2", reviews: "55", hasBooking: "YES", score: "70" },
  { business: "The Detail Shop Nashville", city: "Nashville", niche: "Auto", email: "info@thedetailshopnashvil.com", severity: "LOW", rating: "4.1", reviews: "42", hasBooking: "YES", score: "70" },
  { business: "The Detailing Company", city: "Denver", niche: "Auto", email: "info@thedetailingcompany.com", severity: "LOW", rating: "4.2", reviews: "38", hasBooking: "YES", score: "70" },
  { business: "The Detail Shop Charlotte", city: "Charlotte", niche: "Auto", email: "info@thedetailshopcharlot.com", severity: "LOW", rating: "4.2", reviews: "35", hasBooking: "YES", score: "70" },
];

// Generate social handles
function generateHandle(business) {
  const simple = business.toLowerCase()
    .replace(/['']/g, '')
    .replace(/[&,.]/g, '')
    .replace(/[^a-z0-9\s_]/g, '')
    .replace(/\s+/g, '')
    .substring(0, 30);
  const underscored = business.toLowerCase()
    .replace(/['']/g, '')
    .replace(/[&,.]/g, '')
    .replace(/[^a-z0-9\s_]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 30);
  return { handle: simple, altHandle: underscored };
}

// Build CSV
let csv = 'priority_tier,business,city,niche,rating,reviews,has_booking,score,email,website_domain,website_status,instagram_handle,instagram_url,linkedin_url,dm_sequence_ready,notes\n';

for (const lead of allLeads) {
  const domain = lead.email.split('@')[1];
  const handle = generateHandle(lead.business);
  const igUrl = `https://instagram.com/${handle.handle}`;
  const liSlug = lead.business.toLowerCase().replace(/['']/g, '').replace(/[&]/g, 'and').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const liUrl = `https://www.linkedin.com/company/${liSlug}`;
  const webStatus = domainStatus[domain] || 'UNCHECKED';
  
  // DM sequence readiness
  let dmReady = 'NO';
  let notes = '';
  
  if (lead.severity === 'CRITICAL') {
    dmReady = 'YES_PRIORITY1';
    notes = `TOP PRIORITY. Rating ${lead.rating}. No booking system. Prepare "Connection Guard" DM sequence for Auto.`;
  } else if (lead.severity === 'SEVERE') {
    dmReady = 'YES_PRIORITY2';
    const nicheScript = lead.niche === 'Pet' ? '"Warm Hug"' : 
                        lead.niche === 'Yoga' ? '"Connection Gap"' : 
                        '"Connection Guard"';
    notes = `High priority. Rating ${lead.rating}. Use ${nicheScript} DM script. Verify IG handle before DM (suggested: ${handle.altHandle}).`;
  } else {
    notes = `Lower priority. Rating ${lead.rating}. Queue for Wave 3.`;
  }
  
  // Add domain info
  if (webStatus.startsWith('LIVE')) {
    notes += ` Website: ${domain} is LIVE.`;
  } else if (webStatus === 'NO_DOMAIN') {
    notes += ` No website found at ${domain}. Social-only outreach.`;
  }
  
  // Mark Austin leads
  if (lead.city === 'Austin') {
    notes += ' [AUSTIN - HIGH PRIORITY FOR FOUNDING MEMBER CONVERSION]';
  }
  
  csv += `${lead.severity},"${lead.business}","${lead.city}","${lead.niche}","${lead.rating}","${lead.reviews}","${lead.hasBooking}","${lead.score}","${lead.email}","${domain}","${webStatus}","${handle.handle}","${igUrl}","${liUrl}","${dmReady}","${notes}"\n`;
}

fs.writeFileSync('/home/team/shared/REPORTS/INNOVATION/surgical_49_enriched.csv', csv);

// Count stats
const critical = allLeads.filter(l => l.severity === 'CRITICAL').length;
const severe = allLeads.filter(l => l.severity === 'SEVERE').length;
const moderate = allLeads.filter(l => l.severity === 'MODERATE').length;
const low = allLeads.filter(l => l.severity === 'LOW').length;
const austin = allLeads.filter(l => l.city === 'Austin').length;

console.log('✅ ENRICHMENT COMPLETE');
console.log('======================');
console.log(`File: /home/team/shared/REPORTS/INNOVATION/surgical_49_enriched.csv`);
console.log(`Total leads: ${allLeads.length}`);
console.log(`  CRITICAL (P1): ${critical}`);
console.log(`  SEVERE (P2):   ${severe}`);
console.log(`  MODERATE (P3): ${moderate}`);
console.log(`  LOW (P4):      ${low}`);
console.log(`Austin leads:    ${austin}`);
console.log('');
console.log('=== P1 + P2 Leads (DM Wave Ready) ===');
console.log('');

const priorityLeads = allLeads.filter(l => l.severity === 'CRITICAL' || l.severity === 'SEVERE');
for (const l of priorityLeads) {
  const handle = generateHandle(l.business);
  console.log(`[${l.severity}] ${l.business} | ${l.city} | ${l.niche}`);
  console.log(`       IG: @${handle.handle} | Email: ${l.email}`);
  console.log(`       Notes: Rating ${l.rating}, ${l.reviews} reviews, Booking: ${l.hasBooking}`);
  
  // Show DM script recommendation
  if (l.niche === 'Pet') console.log('       DM Script: "Warm Hug" (Pet)');
  else if (l.niche === 'Yoga') console.log('       DM Script: "Connection Gap" (Yoga)');
  else if (l.niche === 'Auto') console.log('       DM Script: "Connection Guard" (Auto)');
  console.log('');
}