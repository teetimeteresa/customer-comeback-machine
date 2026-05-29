#!/bin/bash

LOG_FILE="/home/team/shared/monitor_daemon.log"

echo "[$(date)] Monitor Daemon starting..." >> "$LOG_FILE"

# Function to run the monitor
run_monitor() {
  NODE_PATH=/home/team/shared/node_modules node /home/team/shared/scripts/monitor-services.js >> "$LOG_FILE" 2>&1
}

while true; do
  run_monitor
  # Wait for 5 minutes during blitz load
  sleep 300
done
