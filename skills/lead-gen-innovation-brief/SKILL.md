---
name: lead-gen-innovation-brief
description: Weekly process for the Growth Hacker to produce a Lead Gen Innovation Brief with execution-ready channel blueprints.
---

# Lead Gen Innovation Brief — Standard Operating Procedure

## When to Use
Every session/week when no urgent tasks are assigned. The Growth Hacker's Always-On R&D directive requires proactively finding new acquisition channels.

## Steps

### 1. Context Gathering
- Read all teammate's completed tasks: `team-db "SELECT id, title, assigned_to, result FROM tasks WHERE status = 'done' ORDER BY updated_at DESC LIMIT 20"`
- Read existing reports in `/home/team/shared/REPORTS/` and `/home/team/shared/REPORTS/INNOVATION/`
- Check the website/app state: `curl -sI http://localhost:3000`
- Read marketing/outreach assets to avoid duplicating existing ideas

### 2. Generate 5-7 Fresh Channel Ideas
Each channel must have:
- **The Insight** — why this works (psychological, technical, or market rationale)
- **Execution Blueprint** — step-by-step, tool recommendations, costs
- **Expected ROI** — realistic conversion estimates
- **Priority Score** — A (do now), B (this week), C (next week)

Channel types to explore:
- Technical Scraping (public data sources)
- Lead Magnets (interactive tools, calculators)
- Strategic Partnerships (complementary service providers)
- Physical Hooks (direct mail, QR kits)
- Social Engineering (group monitoring, sentiment mining)
- Paid Acquisition (niche-specific Google/LinkedIn ads)

### 3. Build the #1 Priority Channel Immediately
The brief is not theoretical. Build at least one channel that can launch immediately:
- Static HTML calculator page (put in `/repo/public/`)
- Scraper script (put in `/repo/scripts/` or `/home/team/shared/REPORTS/INNOVATION/`)
- Email/DM templates (put in `/home/team/shared/REPORTS/INNOVATION/`)

### 4. Save to Disk
- Innovation Brief: `/home/team/shared/REPORTS/INNOVATION/LEAD_GEN_INNOVATION_BRIEF_XXX.md`
- Supporting artifacts: Scripts, templates, CSV trackers in the same dir
- Channel tracker: `/home/team/shared/REPORTS/INNOVATION/channel_performance.csv`

### 5. Notify the Team
- Update `channel_performance.csv` with new channels
- Update memory with key findings
- The brief is discoverable by all team members in the shared directory

## Artifacts Structure
```
REPORTS/INNOVATION/
├── LEAD_GEN_INNOVATION_BRIEF_001.md
├── channel_performance.csv
├── instagram-lead-miner.js
├── instagram_dm_templates.md
└── (any other scripts or templates)
```

## Pro Tips
- Read ALL existing reports before writing — don't duplicate
- Prioritize channels the team can act on TODAY, not next month
- Every script should be runnable with minimal config
- Include the Sales Closer's specific outreach language
- Tag deliverables with which teammate should pick them up
