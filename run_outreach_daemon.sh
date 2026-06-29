#!/bin/bash
# Outreach Daemon — runs the rate-limited engine every 30 minutes
# Usage: nohup bash /home/team/shared/run_outreach_daemon.sh &

PIDFILE="/home/team/shared/outreach_daemon.pid"
LOGFILE="/home/team/shared/outreach_daemon.log"

echo $$ > "$PIDFILE"
echo "[$(date)] Outreach daemon started (PID: $$)" >> "$LOGFILE"

# Source environment variables from .env
set -a
source /home/team/shared/.env 2>/dev/null
set +a

while true; do
    echo "[$(date)] Running outreach cycle..." >> "$LOGFILE"
    cd /home/team/shared && /home/engine/.nvm/versions/node/v24.16.0/bin/node outreach_hardened.js >> "$LOGFILE" 2>&1
    echo "[$(date)] Cycle complete. Sleeping 30 minutes..." >> "$LOGFILE"
    sleep 1800  # 30 minutes
done