#!/bin/bash
# Outreach Daemon — DEPRECATED: Replaced by systemd timer
#
# The outreach engine is now managed by systemd:
#   sudo systemctl start   ccm-outreach.service   # Run once immediately
#   sudo systemctl stop    ccm-outreach.timer      # Stop scheduled runs
#   sudo systemctl start   ccm-outreach.timer      # Resume scheduled runs
#   sudo systemctl status  ccm-outreach.timer      # Check next trigger
#   journalctl -u ccm-outreach.service -f          # Follow live logs
#
# This script is kept for reference only. Do NOT use.
# The systemd timer runs outreach_hardened.js every 30 minutes
# and handles daily counter resets automatically via the state file.
echo "[$(date)] DEPRECATED: Use systemd instead. See /etc/systemd/system/ccm-outreach.{service,timer}"
echo "  sudo systemctl start ccm-outreach.service  # run now"
echo "  sudo systemctl enable --now ccm-outreach.timer  # auto-schedule"
exit 0