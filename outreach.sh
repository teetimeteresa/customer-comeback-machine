#!/bin/bash
# CCM Outreach Management Helper
# Usage: bash /home/team/shared/outreach.sh <command>
#
# Commands:
#   status    - Check timer status and next run time
#   run       - Run the outreach engine immediately (one-shot)
#   start     - Enable the scheduled timer (every 30 min)
#   stop      - Disable the scheduled timer
#   logs      - Follow outreach engine logs from systemd journal
#   log-tail  - Show last 50 lines of outreach log

CMD="${1:-status}"

case "$CMD" in
  status)
    echo "=== TIMER STATUS ==="
    sudo systemctl status ccm-outreach.timer --no-pager 2>&1
    echo ""
    echo "=== LAST RUN ==="
    sudo journalctl -u ccm-outreach.service --no-pager -n 10 2>&1
    echo ""
    echo "=== STATE FILE ==="
    cat /home/team/shared/outreach_state.json 2>/dev/null || echo "(no state file)"
    ;;
  run)
    echo "Running outreach engine now..."
    sudo systemctl start ccm-outreach.service 2>&1
    echo "Done. Check 'logs' for output."
    ;;
  start)
    echo "Enabling scheduled timer (every 30 min)..."
    sudo systemctl enable --now ccm-outreach.timer 2>&1
    ;;
  stop)
    echo "Disabling scheduled timer..."
    sudo systemctl disable --now ccm-outreach.timer 2>&1
    ;;
  logs)
    sudo journalctl -u ccm-outreach.service -f 2>&1
    ;;
  log-tail)
    sudo journalctl -u ccm-outreach.service --no-pager -n 50 2>&1
    ;;
  *)
    echo "Usage: $0 {status|run|start|stop|logs|log-tail}"
    exit 1
    ;;
esac