#!/bin/bash
/home/team/shared/scripts/team-db-locked.sh "SELECT count(*) as total_leads, sum(sales_email_sent) as sent_leads FROM leads" > /home/team/shared/lead_stats.json
