#!/bin/bash
cd /home/team/shared
export RESEND_API_KEY=$(grep -m1 '^RESEND_API_KEY=' .env | cut -d= -f2-)
export NEXT_PUBLIC_APP_URL=https://www.customercomebackmachine.com

while true; do
  state=$(cat outreach_state.json)
  sent=$(echo "$state" | grep -o '"sent_today": [0-9]*' | grep -o '[0-9]*')
  echo "=== $(date '+%H:%M:%S') - $sent/80 ==="
  if [ "$sent" -ge 80 ]; then
    echo "CAP REACHED!"
    break
  fi
  
  # Alternate: recovery -> regular -> recovery -> regular
  # Check if recovery batch still has work
  rec_sent=$(cat recovery_sent_log.json 2>/dev/null | grep -o '"sent_emails"' | wc -l)
  if [ "$rec_sent" -lt 301 ]; then
    node recovery_strike.js >> /tmp/jun30_loop.log 2>&1
  else
    node outreach_hardened.js >> /tmp/jun30_loop.log 2>&1
  fi
done
echo "DONE - $(cat outreach_state.json | grep sent_today)"
