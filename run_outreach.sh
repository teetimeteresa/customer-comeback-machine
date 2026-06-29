#!/bin/bash
# Rate-Limited Outreach Scheduler
# Runs the outreach engine in batches throughout the day.
# Can be run as a cron job: */30 * * * * /home/team/shared/run_outreach.sh
# Or manually: bash /home/team/shared/run_outreach.sh

LOGFILE="/home/team/shared/outreach_scheduler.log"

echo "[$(date)] Starting outreach scheduler..." >> "$LOGFILE"

# Run the outreach engine
cd /home/team/shared
node outreach_rate_limited.js >> "$LOGFILE" 2>&1

echo "[$(date)] Outreach scheduler finished." >> "$LOGFILE"