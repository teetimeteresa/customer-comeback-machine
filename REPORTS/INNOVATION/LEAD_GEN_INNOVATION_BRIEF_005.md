# Innovation Brief #005 — Reactive Retention Automation: From Detection to Outreach

## Session Summary: What We've Built
In the last 3 sessions, we delivered:

| Brief | Focus | Output |
|-------|-------|--------|
| #003 | Scaling Strategy for 80/day cap | 4-phase scaling plan, high-intent signal cheatsheet |
| #004 | Reactive Retention Targets | 20 targets + automation blueprint for review mining |
| #005 | This brief — automation pipeline | The "trigger → score → queue → send" system |

## The Reactive Pipeline: End-to-End Automation

### Component 1: Review Drop Detection (agent-browser cron)
```
Every Monday @ 6:00 AM:
  1. agent-browser searches Google Maps → 6 queries (3 niches × 2 cities)
  2. Extracts: business name + review count + star rating + "Book online" flag
  3. Compares against stored baseline in Turso (baseline_reviews table)
  4. Flags: rating drop >0.5★ OR new 1★ review → "reactive_alert = 1"
```

### Component 2: Scoring Engine (Python script)
```
For each alerted business:
  - Review count <20: +30 pts (hungry)
  - Star rating <4.0: +25 pts (losing)
  - No "Book online": +20 pts (low digital maturity)
  - New review <7 days: +15 pts (fresh pain)
  - Single location: +10 pts (owner-operated, higher conversion)
  
Score >70 = "Hot Lead" → Immediate outreach
Score 40-70 = "Warm Lead" → Queue for next batch
Score <40 = "Monitor" → Store baseline, check next week
```

### Component 3: Outreach Queue Integration
```
When score > 70:
  1. Create lead in Turso: high_intent=1, sales_email_sent=0
  2. Tag with niche: "Cosmetic Dentistry Recovery" / "HVAC Recovery" / "Chiro Recovery"
  3. Push to outreach engine's priority queue
  4. Log to #recovery-alerts channel
```

### Component 4: Recovery Strike Email Sequence
```
Email 1 (Day 0): "We noticed your reviews..."
  Subject: "Your [City] practice just hit a reputation milestone"
  Body: Connection Guard framing, offer to help manage reviews

Email 2 (Day 3): "A competitor is winning"
  Subject: "How [Competitor Name] gained 12 reviews this month"
  Body: Social proof + Connection Guard case study

Email 3 (Day 7): "Last chance — Founding Member rate"
  Subject: "$49 lifetime rate expires this week"
  Body: Urgency + DFY setup offer
```

## OS-Level Automation (systemd Unit)
The pipeline should run as a systemd timer:

```ini
[Unit]
Description=CCM Reactive Retention Scanner

[Service]
Type=oneshot
ExecStart=/home/agent-growth-hacker/.local/bin/reactive-scanner.sh

[Timer]
OnCalendar=Mon *-*-* 06:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

The shell script:
```bash
#!/bin/bash
# reactive-scanner.sh - Weekly review drop detector
cd /home/team/shared

# Step 1: Run Google Maps scans via agent-browser
agent-browser open "https://maps.google.com/maps/search/cosmetic+dentistry+miami+fl/"  
# ... rest of scraping logic

# Step 2: Score and flag targets
python3 scripts/score_reactive_targets.py

# Step 3: Push hot leads to outreach queue
python3 scripts/push_to_outreach.py
```

## What's Working vs What Needs Improvement

### ✅ Working Well
- Google Maps browser scraping yields real business names (5-7 per search)
- Domain email checking via HTTP works for ~70% of domains
- Import pipeline (CSV → vault → Turso) is reliable

### ⚠️ Needs Improvement
- Google Maps limited view (5 results only without signing in)
- Yelp blocks headless browsers completely
- Many algorithmic domains are parked → 4% real-email hit rate
- Review counts not visible without sign-in

### 🔮 Next Evolution: Direct GMB API
If we can get a Google Business Profile API key, we could:
- Query real-time review counts and ratings
- Get notified of new reviews instantly
- Access full review text for sentiment analysis
- Bypass all browser scraping limitations

## ROI Summary
| Phase | Investment | Est. Weekly Yield | Est. MRR |
|-------|-----------|-------------------|----------|
| Browser scraping (current) | 30 min/week | 15-20 targets | $750-1,750 |
| GMB API integration | 2-3 days dev | 50-100 targets | $2,500-5,000 |
| Full automation + scoring | 1 week dev | 100+ targets | $5,000+ |
