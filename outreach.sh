#!/bin/bash
# CCM Outreach & Scanner Management Helper
# Usage: bash /home/team/shared/outreach.sh <command>
#
# Commands:
#   status    - Check timer status and next run time
#   run       - Run the outreach engine immediately (one-shot)
#   start     - Enable the scheduled timer (every 30 min)
#   stop      - Disable the scheduled timer
#   logs      - Follow outreach engine logs from systemd journal
#   log-tail  - Show last 50 lines of outreach log
#   scan      - Run the review scanner immediately
#   scan-logs - Follow scanner logs
#   scan-report - Show the latest scanner report

CMD="${1:-status}"

case "$CMD" in
  status)
    echo "=== OUTREACH TIMER ==="
    sudo systemctl status ccm-outreach.timer --no-pager 2>&1
    echo ""
    echo "=== REVIEW SCANNER TIMER ==="
    sudo systemctl status ccm-review-scanner.timer --no-pager 2>&1 | head -8
    echo ""
    echo "=== OUTREACH LAST RUN ==="
    sudo journalctl -u ccm-outreach.service --no-pager -n 5 2>&1
    echo ""
    echo "=== SCANNER LAST RUN ==="
    sudo journalctl -u ccm-review-scanner.service --no-pager -n 5 2>&1
    echo ""
    echo "=== STATE FILE ==="
    cat /home/team/shared/outreach_state.json 2>/dev/null || echo "(no state file)"
    echo ""
    echo "=== SCANNER REPORT ==="
    cat /home/team/shared/REPORTS/reactive_retention_leads.json 2>/dev/null | head -20 || echo "(no report yet)"
    ;;
  run)
    echo "Running outreach engine now..."
    sudo systemctl start ccm-outreach.service 2>&1
    echo "Done."
    ;;
  start)
    echo "Enabling outreach timer (every 30 min)..."
    sudo systemctl enable --now ccm-outreach.timer 2>&1
    echo "Enabling scanner timer (every 4 hours)..."
    sudo systemctl enable --now ccm-review-scanner.timer 2>&1
    ;;
  stop)
    echo "Disabling outreach timer..."
    sudo systemctl disable --now ccm-outreach.timer 2>&1
    echo "Disabling scanner timer..."
    sudo systemctl disable --now ccm-review-scanner.timer 2>&1
    ;;
  logs)
    sudo journalctl -u ccm-outreach.service -f 2>&1
    ;;
  log-tail)
    sudo journalctl -u ccm-outreach.service --no-pager -n 50 2>&1
    ;;
  scan)
    echo "Running review scanner now..."
    sudo systemctl start ccm-review-scanner.service 2>&1
    echo "Done."
    ;;
  scan-logs)
    sudo journalctl -u ccm-review-scanner.service -f 2>&1
    ;;
  scan-report)
    if [ -f /home/team/shared/REPORTS/reactive_retention_leads.json ]; then
      cat /home/team/shared/REPORTS/reactive_retention_leads.json
    else
      echo "No report yet. Run 'scan' first."
    fi
    ;;
  install)
    echo "Installing systemd units..."
    sudo cp /home/team/shared/ccm-outreach.service /etc/systemd/system/ccm-outreach.service
    sudo cp /home/team/shared/ccm-outreach.timer /etc/systemd/system/ccm-outreach.timer
    sudo cp /home/team/shared/ccm-review-scanner.service /etc/systemd/system/ccm-review-scanner.service
    sudo cp /home/team/shared/ccm-review-scanner.timer /etc/systemd/system/ccm-review-scanner.timer
    sudo systemctl daemon-reload
    sudo systemctl enable --now ccm-outreach.timer
    sudo systemctl enable --now ccm-review-scanner.timer
    echo "Done. Run 'status' to verify."
    ;;
  *)
    echo "Usage: $0 {status|run|start|stop|logs|log-tail|scan|scan-logs|scan-report|install}"
    exit 1
    ;;
esac