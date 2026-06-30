#!/bin/bash
# Quick check of Austin sent leads
sqlite3 -header -column /home/team/shared/austin_leads_v2.db "SELECT business_name, business_type, email FROM leads WHERE city='Austin' AND sales_email_sent=1;" > /tmp/austin_sent.txt 2>&1
echo "=== COUNT ===" >> /tmp/austin_sent.txt
sqlite3 /home/team/shared/austin_leads_v2.db "SELECT COUNT(*) FROM leads WHERE city='Austin' AND sales_email_sent=1;" >> /tmp/austin_sent.txt 2>&1
echo "DONE"