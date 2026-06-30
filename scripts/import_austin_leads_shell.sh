#!/bin/bash
CSV_FILE="/home/team/shared/REPORTS/INNOVATION/high_intent_opportunity_leads.csv"
DB_FILE="/home/team/shared/austin_leads_v2.db"

# Clear existing leads
sqlite3 "$DB_FILE" "DELETE FROM leads;"

# Use awk to parse the CSV and generate INSERT statements
# Columns: 0: name, 1: city, 2: niche, ... 11: email
# Note: we need to handle quotes and only pick Austin leads
awk -F'","' 'NR > 1 && $2 ~ /Austin/ {
    name=$1; sub(/^"/, "", name);
    city=$2;
    niche=$3;
    email=$12; sub(/"$/, "", email);
    if (email ~ /@/) {
        # Simple ID generation
        id="csv-" NR;
        printf "INSERT OR IGNORE INTO leads (id, email, business_name, business_type, city) VALUES (\"%s\", \"%s\", \"%s\", \"%s\", \"%s\");\n", id, email, name, niche, city;
    }
}' "$CSV_FILE" | sqlite3 "$DB_FILE"

echo "Import complete."
sqlite3 "$DB_FILE" "SELECT count(*) FROM leads;"
