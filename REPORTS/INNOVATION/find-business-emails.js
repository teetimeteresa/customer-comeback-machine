/**
 * Business Contact Email Finder
 * 
 * Finds email addresses for the 20 Denver + Miami prospect businesses
 * using public website scraping and directory lookups.
 * 
 * Usage: node find-business-emails.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const CSV_PATH = '/home/team/shared/REPORTS/INNOVATION/gmaps_denver_miami_leads.csv';
const OUTPUT_PATH = '/home/team/shared/REPORTS/INNOVATION/gmaps_denver_miami_leads_with_emails.csv';

// Known or researched contact info for each business
// Sources: Google Maps, business websites, public directories
const CONTACTS = {
  'Cherry Medical': {
    website: 'cherrymedispa.com',
    phone: '(720) 479-8793',
  },
  'VIVE Med Spa': {
    website: 'vivemedspadenver.com',
    phone: null,
  },
  'Rejuvenate MedSpa': {
    website: 'rejuvenatemedspadenver.com',
    phone: null,
  },
  'NakedMD Med Spa Denver': {
    website: 'nakedmd.com',
    phone: null,
  },
  'RESTOR Medical Spa | Central Park': {
    website: 'restormedicalspa.com',
    phone: null,
  },
  'The Denver Dentists': {
    website: 'thedenverdentists.com',
    phone: null,
  },
  'Downtown Denver Dental': {
    website: 'downtowndenverdental.com',
    phone: null,
  },
  'Icon Dental': {
    website: 'icondentaldenver.com',
    phone: null,
  },
  'Denver Place Dentistry': {
    website: 'denverplacedentistry.com',
    phone: null,
  },
  '38th Modern Dental': {
    website: '38thmoderndental.com',
    phone: null,
  },
  'Monaco MedSpa': {
    website: 'monacomedspa.com',
    phone: null,
  },
  'Med Aesthetics Miami': {
    website: 'medaestheticsmiami.com',
    phone: null,
  },
  'Deluxe Med Spa Beauty': {
    website: 'deluxemedspabeauty.com',
    phone: null,
  },
  'Arviv Medical Aesthetics Miami': {
    website: 'arvivmedspa.com',
    phone: null,
  },
  'Brickell Cosmetic Center': {
    website: 'brickellcosmetic.com',
    phone: null,
  },
  'Super Dentist Miami': {
    website: 'superdentistmiami.com',
    phone: null,
  },
  'Relax and Smile Dental Care': {
    website: 'relaxandsmiledental.com',
    phone: null,
  },
  'Miami Modern Dental': {
    website: 'miamimoderndental.com',
    phone: null,
  },
  'Ultra Smile Miami': {
    website: 'ultrasmilemiami.com',
    phone: null,
  },
  'Midtown Dental Miami': {
    website: 'midtowndentalmiami.com',
    phone: null,
  },
};

// Email patterns to search on pages
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|us|co|io)/gi;

// Phone patterns
const PHONE_REGEX = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

/**
 * Fetch a webpage and extract emails
 */
function fetchAndExtract(url, timeout = 8000) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const emails = [...new Set((data.match(EMAIL_REGEX) || []).map(e => e.toLowerCase()))];
        const phones = [...new Set((data.match(PHONE_REGEX) || []))];
        resolve({ emails, phones, status: res.statusCode });
      });
    });
    req.on('error', () => resolve({ emails: [], phones: [], status: 0 }));
    req.on('timeout', () => { req.destroy(); resolve({ emails: [], phones: [], status: 0 }); });
  });
}

/**
 * Try common URL patterns for a business
 */
function buildUrls(biz) {
  const name = biz.Business;
  const contact = CONTACTS[name];
  const domain = contact?.website;
  
  if (!domain) return [];
  
  return [
    `https://${domain}`,
    `https://${domain}/contact`,
    `https://www.${domain}`,
    `https://www.${domain}/contact`,
  ];
}

async function main() {
  console.log('=== Business Email Finder ===');
  console.log('');
  
  // Read existing CSV
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  // Parse businesses
  const businesses = lines.slice(1).map(line => {
    const vals = [];
    let cur = '', inQ = false;
    for (const c of line) {
      if (c === '"') inQ = !inQ;
      else if (c === ',' && !inQ) { vals.push(cur.trim()); cur = ''; }
      else cur += c;
    }
    vals.push(cur.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = vals[i] || '');
    return obj;
  });
  
  console.log(`Loaded ${businesses.length} businesses`);
  console.log('');
  
  // Add email and phone columns
  const newHeaders = [...headers, 'Email', 'Phone', 'Website'];
  
  // Process each business
  for (let i = 0; i < businesses.length; i++) {
    const biz = businesses[i];
    const name = biz.Business.split(',')[0];
    const contact = CONTACTS[name] || {};
    
    let email = '';
    let phone = '';
    let website = contact.website || '';
    
    // Try to find contact info from the web
    if (website) {
      const urls = buildUrls(biz);
      for (const url of urls) {
        const result = await fetchAndExtract(url);
        if (result.emails.length > 0) {
          // Filter out generic/no-reply emails
          const realEmails = result.emails.filter(e => !e.includes('noreply') && !e.includes('no-reply'));
          if (realEmails.length > 0) {
            email = realEmails[0];
          }
        }
        if (result.phones.length > 0 && !phone) {
          phone = result.phones[0];
        }
        if (email) break;
      }
    }
    
    // Use Google Maps phone if available
    if (!phone && contact.phone) {
      phone = contact.phone;
    }
    
    // Update biz object
    biz.Email = email;
    biz.Phone = phone;
    biz.Website = website;
    
    const status = email ? '✅ Found email' : '⏳ Need to find';
    console.log(`${i+1}. ${name.padEnd(30)} ${status.padEnd(20)} ${email ? email : '---'}`);
  }
  
  // Write updated CSV
  const rows = [newHeaders.join(',')];
  for (const biz of businesses) {
    const row = newHeaders.map(h => {
      const val = biz[h] || '';
      return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
    });
    rows.push(row.join(','));
  }
  
  fs.writeFileSync(OUTPUT_PATH, rows.join('\n'));
  console.log('');
  console.log(`✅ Saved to ${OUTPUT_PATH}`);
  console.log('');
  
  // Summary
  const found = businesses.filter(b => b.Email).length;
  const phoneOnly = businesses.filter(b => !b.Email && b.Phone).length;
  const none = businesses.filter(b => !b.Email && !b.Phone).length;
  console.log(`Summary: ${found} with email | ${phoneOnly} phone only | ${none} need manual lookup`);
  console.log('');
  console.log('Businesses needing manual email lookup:');
  businesses.filter(b => !b.Email).forEach(b => {
    console.log(`  🔍 ${b.Business} (${b.City}) — https://${b.Website || '[no site found]'}`);
  });
}

main().catch(console.error);