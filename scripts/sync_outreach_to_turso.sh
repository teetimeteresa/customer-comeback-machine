#!/bin/bash
#===============================================================================
# sync_outreach_to_turso.sh — Batch sync outreach results to Turso team-db
#
# Reads a JSON batch file from $1 (created by outreach_hardened.js after each
# batch run) and syncs two things:
#   1. Updates `leads.sales_email_sent = 1` for each sent lead
#   2. Inserts a row into `outreach_log` for each sent email
#
# Design: minimal team-db calls (1 UPDATE + 1 INSERT per batch, not per email)
# to reduce WAL/locking pressure from concurrent agent writes.
#
# Usage: sync_outreach_to_turso.sh <batch_file.json>
# Batch file format: JSON array of objects with keys:
#   lead_id, email, niche, business_name, method, tracking_id, status
#===============================================================================

set -euo pipefail

BATCH_FILE="${1:?Usage: $0 <batch_file.json>}"
if [ ! -f "$BATCH_FILE" ]; then
  echo "ERROR: Batch file not found: $BATCH_FILE" >&2
  exit 1
fi

# Use the centralized lock script to serialize team-db access
TEAM_DB_CMD="/home/team/shared/scripts/team-db-locked.sh"

# Read the batch JSON
BATCH_JSON=$(cat "$BATCH_FILE")
COUNT=$(echo "$BATCH_JSON" | jq length 2>/dev/null || echo 0)

if [ "$COUNT" -eq 0 ]; then
  echo "No records to sync. Exiting."
  exit 0
fi

echo "Syncing $COUNT outreach results to Turso..."

#───────────────────────────────────────────────────────────────────────────────
# Step 1: Build a properly quoted IN clause and UPDATE leads
# Use @sh format in jq which produces properly shell-quoted strings,
# then convert to SQL single-quoted format.
#───────────────────────────────────────────────────────────────────────────────
IDS_QUOTED=$(echo "$BATCH_JSON" | jq -r '[.[] | .lead_id] | map("\"\(.)\"") | join(",")')
# The above gives "id1","id2" — need SQL single quotes instead
IDS_QUOTED=$(echo "$IDS_QUOTED" | sed 's/"/'"'"'/g')

if [ -n "$IDS_QUOTED" ] && [ "$IDS_QUOTED" != "''" ] && [ "$IDS_QUOTED" != "''''" ]; then
  SQL_UPDATE="UPDATE leads SET sales_email_sent = 1 WHERE id IN ($IDS_QUOTED)"
  
  echo "  Running: UPDATE leads SET sales_email_sent = 1 WHERE id IN (...${COUNT} IDs...)"
  $TEAM_DB_CMD "$SQL_UPDATE" 2>&1 || echo "  WARN: sales_email_sent UPDATE failed (non-fatal)"
fi

#───────────────────────────────────────────────────────────────────────────────
# Step 2: Insert into outreach_log (one INSERT per record — INSERTs are cheap)
#───────────────────────────────────────────────────────────────────────────────
echo "$BATCH_JSON" | jq -c '.[]' | while IFS= read -r record; do
  LEAD_ID=$(echo "$record" | jq -r '.lead_id // ""' | sed "s/'/''/g")
  METHOD=$(echo "$record" | jq -r '.method // "email"' | sed "s/'/''/g")
  CONTENT=$(echo "$record" | jq -r '.subject // "Outreach email"' | sed "s/'/''/g")
  NICHE=$(echo "$record" | jq -r '.niche // ""' | sed "s/'/''/g")
  TRACKING_ID=$(echo "$record" | jq -r '.tracking_id // ""' | sed "s/'/''/g")
  STATUS=$(echo "$record" | jq -r '.status // "sent"' | sed "s/'/''/g")
  
  SQL_INSERT="INSERT INTO outreach_log (lead_id, method, content, niche, tracking_id, status, timestamp) VALUES ('$LEAD_ID', '$METHOD', '$CONTENT', '$NICHE', '$TRACKING_ID', '$STATUS', datetime('now'))"
  
  $TEAM_DB_CMD "$SQL_INSERT" 2>&1 || echo "  WARN: outreach_log INSERT failed for $LEAD_ID"
done

echo "Sync complete: $COUNT records sent to Turso."