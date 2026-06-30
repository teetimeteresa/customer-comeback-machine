#!/usr/bin/env node
/**
 * Enrich the Surgical 49 leads with Instagram and LinkedIn profile URLs.
 * Uses business names and website domains to construct likely social profiles.
 * Focuses on SEVERE and CRITICAL leads first.
 */

const fs = require('fs');

// The leads data parsed from the CSV
const leads = [
  // ===== CRITICAL (highest priority) =====
  { business: "Music City Auto Repair", city: "Nashville", niche: "Auto", email: "info@musiccityautorepair.com", severity: "CRITICAL" },
  
  // ===== SEVERE =====
  { business: "Paw Pleasers Grooming", city: "Charlotte", niche: "Pet", email: "hello@pawpleasersgrooming.com", severity: "SEVERE" },
  { business: "Vibe Yoga Studio", city: "Charlotte", niche: "Yoga", email: "flow@vibeyogastudio.com", severity: "SEVERE" },
  { business: "Pride & Groom Scottsdale", city: "Scottsdale", niche: "Pet", email: "hello@pridegroomscottsdale.com", severity: "SEVERE" },
  { business: "Elite Finish Auto", city: "Denver", niche: "Auto", email: "info@elitefinishauto.com", severity: "SEVERE" },
  { business: "Culvers Auto Body", city: "Scottsdale", niche: "Auto", email: "info@culversautobody.com", severity: "SEVERE" },
  { business: "Scottdale Auto Repair", city: "Scottsdale", niche: "Auto", email: "info@scottdaleautorepair.com", severity: "SEVERE" },
  { business: "Elite Auto Werks", city: "Nashville", niche: "Auto", email: "info@eliteautowerks.com", severity: "SEVERE" },
  { business: "Denver Dog Grooming", city: "Denver", niche: "Pet", email: "hello@denverdoggrooming.com", severity: "SEVERE" },
  { business: "Colorado Auto Repair", city: "Denver", niche: "Auto", email: "info@coloradoautorepair.com", severity: "SEVERE" },
  { business: "AutoWerks Charlotte", city: "Charlotte", niche: "Auto", email: "info@autowerkscharlotte.com", severity: "SEVERE" },

  // ===== MODERATE (Austin & priority markets) =====
  { business: "Music City Auto Repair", city: "Nashville", niche: "Auto", email: "info@musiccityautorepair.com", severity: "CRITICAL" },
  { business: "Austin Detailing Specialists", city: "Austin", niche: "Auto", email: "info@austindetailingspeci.com", severity: "MODERATE" },
  { business: "Radiant Yoga Austin", city: "Austin", niche: "Yoga", email: "flow@radiantyogaaustin.com", severity: "MODERATE" },
  { business: "The Bakery At Scottsdale", city: "Scottsdale", niche: "Bakery", email: "sweet@thebakeryatscottsdal.com", severity: "MODERATE" },
  { business: "Pawsitively Groomed", city: "Nashville", niche: "Pet", email: "hello@pawsitivelygroomed.com", severity: "MODERATE" },
  { business: "Ivey Cake Bakery", city: "Nashville", niche: "Bakery", email: "sweet@iveycakebakery.com", severity: "MODERATE" },
  { business: "Yoga Tree Nashville", city: "Nashville", niche: "Yoga", email: "flow@yogatreenashville.com", severity: "MODERATE" },
  { business: "Paw Works Denver", city: "Denver", niche: "Pet", email: "hello@pawworksdenver.com", severity: "MODERATE" },
  { business: "Villanis Gourmet Bakery", city: "Charlotte", niche: "Bakery", email: "sweet@villanisgourmetbaker.com", severity: "MODERATE" },
  { business: "Superior Auto Body Austin", city: "Austin", niche: "Auto", email: "info@superiorautobodyaust.com", severity: "MODERATE" },
  { business: "Texas French Bread", city: "Austin", niche: "Bakery", email: "sweet@texasfrenchbread.com", severity: "MODERATE" },
  { business: "Sun Devil Auto Scottsdale", city: "Scottsdale", niche: "Auto", email: "info@sundevilautoscottsda.com", severity: "MODERATE" },
  { business: "True Hot Yoga", city: "Scottsdale", niche: "Yoga", email: "flow@truehotyoga.com", severity: "MODERATE" },
  { business: "Exotic Motors Denver", city: "Denver", niche: "Auto", email: "info@exoticmotorsdenver.com", severity: "MODERATE" },
  { business: "Samadhi Yoga", city: "Denver", niche: "Yoga", email: "flow@samadhiyoga.com", severity: "MODERATE" },
  { business: "Superior Auto Charlotte", city: "Charlotte", niche: "Auto", email: "info@superiorautocharlott.com", severity: "MODERATE" },
  { business: "River Yoga Denver", city: "Denver", niche: "Yoga", email: "flow@riveryogadenver.com", severity: "MODERATE" },
  { business: "JL Desserts", city: "Scottsdale", niche: "Bakery", email: "sweet@jldesserts.com", severity: "MODERATE" },

  // ===== LOWER PRIORITY =====
  { business: "Echo Coffee", city: "Scottsdale", niche: "Coffee", email: "brew@echocoffee.com", severity: "LOW" },
  { business: "The Yoga Room", city: "Scottsdale", niche: "Yoga", email: "flow@theyogaroom.com", severity: "LOW" },
  { business: "Woofs Dog Grooming", city: "Nashville", niche: "Pet", email: "hello@woofsdoggrooming.com", severity: "LOW" },
  { business: "Baked on 8th", city: "Nashville", niche: "Bakery", email: "sweet@bakedon8th.com", severity: "LOW" },
  { business: "Nashville Power Yoga", city: "Nashville", niche: "Yoga", email: "flow@nashvillepoweryoga.com", severity: "LOW" },
  { business: "Aussie Pet Mobile Denver", city: "Denver", niche: "Pet", email: "hello@aussiepetmobiledenve.com", severity: "LOW" },
  { business: "Grateful Bread Bakery", city: "Denver", niche: "Bakery", email: "sweet@gratefulbreadbakery.com", severity: "LOW" },
  { business: "Woof Gang Bakery Charlotte", city: "Charlotte", niche: "Pet", email: "hello@woofgangbakerycharlo.com", severity: "LOW" },
  { business: "Queen City Grounds", city: "Charlotte", niche: "Coffee", email: "brew@queencitygrounds.com", severity: "LOW" },
  { business: "Studio 108 Yoga", city: "Charlotte", niche: "Yoga", email: "flow@studio108yoga.com", severity: "LOW" },
  { business: "Blue Lotus Yoga", city: "Charlotte", niche: "Yoga", email: "flow@bluelotusyoga.com", severity: "LOW" },
  { business: "Bark Avenue Scottsdale", city: "Scottsdale", niche: "Pet", email: "hello@barkavenuescottsdale.com", severity: "LOW" },
  { business: "Bongo Java", city: "Nashville", niche: "Coffee", email: "brew@bongojava.com", severity: "LOW" },
  { business: "Sift Bake Shop", city: "Nashville", niche: "Bakery", email: "sweet@siftbakeshop.com", severity: "LOW" },
  { business: "Desserts By Helen", city: "Denver", niche: "Bakery", email: "sweet@dessertsbyhelen.com", severity: "LOW" },
  { business: "Suarez Bakery", city: "Charlotte", niche: "Bakery", email: "sweet@suarezbakery.com", severity: "LOW" },
  { business: "The Detail Shop Austin", city: "Austin", niche: "Auto", email: "info@thedetailshopaustin.com", severity: "LOW" },
  { business: "Dharma Yoga Austin", city: "Austin", niche: "Yoga", email: "flow@dharmayogaaustin.com", severity: "LOW" },
  { business: "The Detail Shop Nashville", city: "Nashville", niche: "Auto", email: "info@thedetailshopnashvil.com", severity: "LOW" },
  { business: "The Detailing Company", city: "Denver", niche: "Auto", email: "info@thedetailingcompany.com", severity: "LOW" },
  { business: "The Detail Shop Charlotte", city: "Charlotte", niche: "Auto", email: "info@thedetailshopcharlot.com", severity: "LOW" },
];

// Deduplicate by email
const seen = new Set();
const uniqueLeads = [];
for (const l of leads) {
  if (!seen.has(l.email)) {
    seen.add(l.email);
    uniqueLeads.push(l);
  }
}

/**
 * Construct likely Instagram handle from business name
 * Rules: lowercase, remove special chars, spaces become underscores or dots
 */
function guessInstagramHandle(business, city, niche) {
  let name = business.toLowerCase()
    .replace(/['']/g, '')
    .replace(/[&,.]/g, '')
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9_]/g, '');
  
  // Common truncation at 30 chars (IG max)
  if (name.length > 30) name = name.substring(0, 30);
  
  // Also try with underscores
  let nameUnderscore = business.toLowerCase()
    .replace(/['']/g, '')
    .replace(/[&,.]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
  if (nameUnderscore.length > 30) nameUnderscore = nameUnderscore.substring(0, 30);
  
  return [name, nameUnderscore];
}

/**
 * Construct likely LinkedIn URL
 */
function guessLinkedInUrl(business, city) {
  const slug = business.toLowerCase()
    .replace(/['']/g, '')
    .replace(/[&,.]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
  return `https://www.linkedin.com/company/${slug}`;
}

/**
 * Get website domain from email
 */
function getWebsiteDomain(email) {
  return email.split('@')[1];
}

// Generate enriched CSV
let csv = 'business,city,niche,email,severity,website,instagram_handle,instagram_url,linkedin_url,notes\n';

for (const lead of uniqueLeads) {
  const domain = getWebsiteDomain(lead.email);
  const website = `https://${domain}`;
  const igHandles = guessInstagramHandle(lead.business, lead.city, lead.niche);
  const igUrl1 = `https://instagram.com/${igHandles[0]}`;
  const igUrl2 = `https://instagram.com/${igHandles[1]}`;
  const liUrl = guessLinkedInUrl(lead.business, lead.city);
  
  const notes = `Likely IG handle: ${igHandles[0]} or ${igHandles[1]}. Website domain: ${domain}. Verify before DM.`;
  
  csv += `"${lead.business}","${lead.city}","${lead.niche}","${lead.email}","${lead.severity}","${website}","${igHandles[0]}","${igUrl1}","${liUrl}","${notes}"\n`;
}

fs.writeFileSync('/home/team/shared/REPORTS/INNOVATION/surgical_49_enriched.csv', csv);
console.log(`✅ Enriched CSV written to /home/team/shared/REPORTS/INNOVATION/surgical_49_enriched.csv`);
console.log(`   Total leads: ${uniqueLeads.length}`);
console.log(`   Critical: ${uniqueLeads.filter(l => l.severity === 'CRITICAL').length}`);
console.log(`   Severe: ${uniqueLeads.filter(l => l.severity === 'SEVERE').length}`);
console.log(`   Moderate: ${uniqueLeads.filter(l => l.severity === 'MODERATE').length}`);
console.log(`   Low: ${uniqueLeads.filter(l => l.severity === 'LOW').length}`);