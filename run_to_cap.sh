#!/bin/bash
cd /home/team/shared
while true; do
  state=$(cat outreach_state.json)
  sent=$(echo "$state" | grep -o '"sent_today": [0-9]*' | grep -o '[0-9]*')
  echo "=== $(date '+%H:%M:%S') - $sent/80 ==="
  if [ "$sent" -ge 80 ]; then
    echo "CAP REACHED!"
    break
  fi
  node outreach_hardened.js >> /tmp/outreach_loop.log 2>&1
done
echo "DONE - $(cat outreach_state.json | grep sent_today)"
