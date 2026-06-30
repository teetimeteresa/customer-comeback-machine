#!/usr/bin/env node
/**
 * Reactive Retention Review Scanner v1.0
 * 
 * Scrapes Google Maps for business ratings and review counts.
 * Flags businesses with <20 reviews OR <4.0★ as "high intent recovery".
 * Stores baselines for weekly comparison (Phase 2).
 * 
 * Usage: node scripts/review_scanner.js              # Scan all targets
 *        node scripts/review_scanner.js --delta       # Compare vs baselines
 *        node scripts/review_scanner.js --outreach    # Output flagged to outreach queue
 * 
 * Innovation Brief #004 — Reactive Retention
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DATA_DIR = '/home/team/shared/REPORTS/INNOVATION';
const TARGETS_FILE = path.join(DATA_DIR, 'reactive_targets.json');
const BASELINE_FILE = path.join(DATA_DIR, 'review_baselines.json');
const FLAGGED_FILE = path.join(DATA_DIR, 'flagged_for_outreach.json');
const LOG_FILE = path.join(DATA_DIR, 'review_scanner.log');

// ─── 20 Reactive Retention Targets from Innovation Brief #004 ──────────────
const TARGETS = [
  // Miami-Fort Lauderdale — Cosmetic Dentistry
  { id: 'mia_dental_1', name: 'Miami Beach Dental', niche: 'dentistry', city: 'Miami Beach', query: 'Miami Beach Dental cosmetic dentistry Miami Beach' },
  { id: 'mia_dental_2', name: 'Cutler Bay Dental', niche: 'dentistry', city: 'Cutler Bay', query: 'Cutler Bay Dental cosmetic dentistry Cutler Bay' },
  { id: 'mia_dental_3', name: 'Homestead Cosmetic Dentistry', niche: 'dentistry', city: 'Homestead', query: 'Homestead Cosmetic Dentistry Homestead' },
  // Miami-Fort Lauderdale — HVAC
  { id: 'mia_hvac_1', name: 'Palmetto Bay AC', niche: 'hvac', city: 'Palmetto Bay', query: 'Palmetto Bay AC heating cooling Palmetto Bay' },
  { id: 'mia_hvac_2', name: 'Flow-Tech Air Conditioning Corp', niche: 'hvac', city: 'Miami', query: 'Flow-Tech Air Conditioning Corp Miami' },
  { id: 'mia_hvac_3', name: 'Best Price Mini Splits Miami', niche: 'hvac', city: 'Miami', query: 'Best Price Mini Splits Miami' },
  { id: 'mia_hvac_4', name: 'Direct Air Conditioning', niche: 'hvac', city: 'Miami', query: 'Direct Air Conditioning Miami' },
  { id: 'mia_hvac_5', name: 'AC Solution RG Corp', niche: 'hvac', city: 'Miami', query: 'AC Solution RG Corp Miami' },
  // Miami-Fort Lauderdale — Chiropractic
  { id: 'mia_chiro_1', name: 'Kendall Wellness Center', niche: 'chiropractic', city: 'Kendall', query: 'Kendall Wellness Center chiropractic Kendall' },
  { id: 'mia_chiro_2', name: 'Miami Spine & Injury Center', niche: 'chiropractic', city: 'Miami', query: 'Miami Spine & Injury Center Miami' },
  { id: 'mia_chiro_3', name: 'Kendall Back & Neck Center', niche: 'chiropractic', city: 'Kendall', query: 'Kendall Back & Neck Center chiropractic Kendall' },
  { id: 'mia_chiro_4', name: 'Doral Wellness & Chiropractic', niche: 'chiropractic', city: 'Doral', query: 'Doral Wellness & Chiropractic Doral' },
  // Greater Phoenix — Cosmetic Dentistry
  { id: 'phx_dental_1', name: 'Downtown Phoenix Dental', niche: 'dentistry', city: 'Phoenix', query: 'Downtown Phoenix Dental Phoenix' },
  { id: 'phx_dental_2', name: 'Arizona Smile Center', niche: 'dentistry', city: 'Phoenix', query: 'Arizona Smile Center Phoenix' },
  { id: 'phx_dental_3', name: 'Buckeye Dental', niche: 'dentistry', city: 'Buckeye', query: 'Buckeye Dental Buckeye Arizona' },
  // Greater Phoenix — HVAC
  { id: 'phx_hvac_1', name: 'Chandler Cooling Masters', niche: 'hvac', city: 'Chandler', query: 'Chandler Cooling Masters HVAC Chandler' },
  { id: 'phx_hvac_2', name: 'Peoria AC & Heating Co', niche: 'hvac', city: 'Peoria', query: 'Peoria AC and Heating Co Peoria Arizona' },
  // Greater Phoenix — Chiropractic
  { id: 'phx_chiro_1', name: 'Cave Creek Chiropractic', niche: 'chiropractic', city: 'Cave Creek', query: 'Cave Creek Chiropractic Cave Creek' },
  { id: 'phx_chiro_2', name: 'Glendale Chiropractic & Wellness', niche: 'chiropractic', city: 'Glendale', query: 'Glendale Chiropractic Wellness Glendale Arizona' },
  { id: 'phx_chiro_3', name: 'Mesa Spine & Rehab', niche: 'chiropractic', city: 'Mesa', query: 'Mesa Spine Rehab chiropractic Mesa' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  try { fs.appendFileSync(LOG_FILE, line + '\n'); } catch (e) {}
}

function readJSON(file, fallback) {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) { log(`Read error ${file}: ${e.message}`); }
  return fallback;
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Agent-Browser Google Maps Scraper ────────────────────────────────────

async function scrapeBusinessRating(query) {
  /**
   * Uses agent-browser to search Google Maps and extract rating + review count.
   * Returns { rating: number|null, reviews: number|null, error: string|null }
   */
  try {
    // Build the Google Maps search URL
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    
    // Use agent-browser via the CLI
    const cmd = `agent-browser goto "${searchUrl}" 2>/dev/null`;
    const output = execSync(cmd, { encoding: 'utf8', timeout: 30000, maxBuffer: 1024 * 1024 });
    
    // Try common patterns for rating/review extraction
    // Pattern 1: "★ X.X (N reviews)" 
    const ratingMatch = output.match(/★\s*([\d.]+)\s*\((\d+)\s*reviews?\)/i);
    if (ratingMatch) {
      return { rating: parseFloat(ratingMatch[1]), reviews: parseInt(ratingMatch[2]), error: null };
    }
    
    // Pattern 2: "X.X ★  · N reviews"
    const ratingMatch2 = output.match(/([\d.]+)\s*★\s*·\s*(\d+)\s*reviews?/i);
    if (ratingMatch2) {
      return { rating: parseFloat(ratingMatch2[1]), reviews: parseInt(ratingMatch2[2]), error: null };
    }
    
    // Pattern 3: JSON-LD structured data
    const jsonLdMatch = output.match(/"ratingValue":\s*([\d.]+)[^}]*"reviewCount":\s*(\d+)/i);
    if (jsonLdMatch) {
      return { rating: parseFloat(jsonLdMatch[1]), reviews: parseInt(jsonLdMatch[2]), error: null };
    }
    
    return { rating: null, reviews: null, error: 'Could not extract rating from page' };
  } catch (e) {
    return { rating: null, reviews: null, error: e.message };
  }
}

// ─── Scoring Engine (Phase 1) ─────────────────────────────────────────────

function scoreBusiness(target, scan) {
  const signals = [];
  let score = 100; // Start perfect, deduct for risk signals
  
  if (scan.rating === null) {
    signals.push('NO_DATA');
    score -= 30;
  } else if (scan.rating <= 3.5) {
    signals.push('LOW_RATING');
    score -= 40;
  } else if (scan.rating < 4.0) {
    signals.push('BELOW_4_STAR');
    score -= 20;
  }
  
  if (scan.reviews === null) {
    signals.push('NO_REVIEW_DATA');
    score -= 20;
  } else if (scan.reviews < 20) {
    signals.push('LOW_REVIEW_COUNT');
    score -= 25;
  } else if (scan.reviews < 50) {
    signals.push('MODERATE_REVIEWS');
    score -= 10;
  }
  
  // High intent = fresh pain
  const isHighIntent = (
    scan.rating !== null && scan.rating < 4.0 ||
    scan.reviews !== null && scan.reviews < 20
  );
  
  return {
    target_id: target.id,
    business_name: target.name,
    niche: target.niche,
    city: target.city,
    rating: scan.rating,
    review_count: scan.reviews,
    signals: signals,
    priority_score: Math.max(0, score),
    high_intent: isHighIntent,
    scanned_at: new Date().toISOString(),
    error: scan.error,
  };
}

// ─── Main Scanner ─────────────────────────────────────────────────────────

async function scanAll() {
  log('=== Reactive Retention Review Scanner v1.0 START ===');
  log(`Targets to scan: ${TARGETS.length}`);
  
  const baselines = readJSON(BASELINE_FILE, {});
  const results = [];
  
  for (let i = 0; i < TARGETS.length; i++) {
    const target = TARGETS[i];
    log(`[${i+1}/${TARGETS.length}] Scanning: ${target.name} (${target.city})...`);
    
    const scan = await scrapeBusinessRating(target.query);
    const scored = scoreBusiness(target, scan);
    results.push(scored);
    
    if (scored.error) {
      log(`  ⚠ ${scored.error}`);
    } else {
      log(`  ★ ${scored.rating} (${scored.reviews} reviews) → Score: ${scored.priority_score}${scored.high_intent ? ' 🚨 HIGH INTENT' : ''}`);
    }
    
    // Update baseline
    baselines[target.id] = {
      name: target.name,
      last_rating: scan.rating,
      last_reviews: scan.reviews,
      last_scanned: new Date().toISOString(),
    };
    
    // Be nice to Google - delay between requests
    if (i < TARGETS.length - 1) await sleep(3000);
  }
  
  // Save baselines
  writeJSON(BASELINE_FILE, baselines);
  log(`Baselines saved to ${BASELINE_FILE}`);
  
  // Save full results
  writeJSON(path.join(DATA_DIR, 'scan_results.json'), results);
  log(`Results saved to ${DATA_DIR}/scan_results.json`);
  
  // Flag high-intent targets
  const flagged = results.filter(r => r.high_intent);
  writeJSON(FLAGGED_FILE, flagged);
  log(`Flagged ${flagged.length} targets for outreach`);
  
  // Summary
  const highIntent = results.filter(r => r.high_intent);
  const withData = results.filter(r => r.rating !== null);
  log(`=== SCAN COMPLETE ===`);
  log(`Scanned: ${results.length} targets`);
  log(`With data: ${withData.length}/${results.length}`);
  log(`High intent (flagged): ${highIntent.length}`);
  log(`Flagged list: ${FLAGGED_FILE}`);
  
  return { results, flagged, baselines };
}

// ─── Delta Detection (Phase 2 - Weekly) ───────────────────────────────────

function detectDeltas() {
  log('=== Delta Detection (Weekly Comparison) ===');
  
  const baselines = readJSON(BASELINE_FILE, {});
  const previous = readJSON(path.join(DATA_DIR, 'scan_results.json'), []);
  
  if (previous.length === 0) {
    log('No previous scan data. Run full scan first.');
    return [];
  }
  
  const deltas = [];
  for (const prev of previous) {
    const baseline = baselines[prev.target_id];
    if (!baseline || !prev.rating) continue;
    
    const currentRating = baseline.last_rating;
    const currentReviews = baseline.last_reviews;
    const prevRating = prev.rating;
    const prevReviews = prev.review_count;
    
    if (currentRating === null || prevRating === null) continue;
    
    const ratingDelta = currentRating - prevRating;
    const reviewDelta = (currentReviews || 0) - (prevReviews || 0);
    
    if (ratingDelta < -0.5 || (reviewDelta < 0 && currentRating < 4.0)) {
      deltas.push({
        target_id: prev.target_id,
        business_name: prev.business_name,
        rating_change: ratingDelta,
        review_change: reviewDelta,
        previous_rating: prevRating,
        current_rating: currentRating,
        alert: reviewDelta < 0 ? 'RATING_DROP' : 'NEGATIVE_TREND',
      });
    }
  }
  
  writeJSON(path.join(DATA_DIR, 'review_deltas.json'), deltas);
  log(`Deltas detected: ${deltas.length}`);
  return deltas;
}

// ─── Outreach Queue Export ────────────────────────────────────────────────

function exportOutreach() {
  log('=== Exporting Flagged Targets to Outreach Queue ===');
  
  const flagged = readJSON(FLAGGED_FILE, []);
  if (flagged.length === 0) {
    log('No flagged targets. Run scan first.');
    return;
  }
  
  // Format for the outreach engine
  const outreach = flagged.map(f => ({
    id: f.target_id,
    business_name: f.business_name,
    niche: f.niche,
    city: f.city,
    rating: f.rating,
    review_count: f.review_count,
    priority_score: f.priority_score,
    signals: f.signals,
    template: 'reactive_retention',
  }));
  
  writeJSON(path.join(DATA_DIR, 'outreach_queue.json'), outreach);
  log(`Exported ${outreach.length} to outreach queue`);
  
  // Also write a simple CSV
  const csvLines = ['id,business_name,niche,city,rating,review_count,priority_score,signals'];
  for (const o of outreach) {
    csvLines.push(`${o.id},"${o.business_name}",${o.niche},${o.city},${o.rating},${o.review_count},${o.priority_score},"${o.signals.join(';')}"`);
  }
  fs.writeFileSync(path.join(DATA_DIR, 'outreach_queue.csv'), csvLines.join('\n'));
  log(`CSV written to ${DATA_DIR}/outreach_queue.csv`);
}

// ─── CLI ──────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--delta')) {
    detectDeltas();
    return;
  }
  
  if (args.includes('--outreach')) {
    exportOutreach();
    return;
  }
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Reactive Retention Review Scanner v1.0
Usage:
  node scripts/review_scanner.js            Full scan + flagging
  node scripts/review_scanner.js --delta     Compare vs baselines
  node scripts/review_scanner.js --outreach  Export flagged to queue
  node scripts/review_scanner.js --help      This help
    `);
    return;
  }
  
  // Default: full scan
  await scanAll();
  
  // Auto-detect deltas if we have previous data
  const previous = readJSON(path.join(DATA_DIR, 'scan_results.json'), []);
  if (previous.length > 0) {
    detectDeltas();
  }
  
  // Export to outreach queue
  exportOutreach();
}

main().catch(e => {
  log(`FATAL: ${e.message}`);
  console.error(e);
  process.exit(1);
});