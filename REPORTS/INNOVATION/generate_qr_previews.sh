#!/bin/bash
# Generate digital QR previews for Physical Outreach Prospects
# Uses the Google Charts QR API (free, no key needed)
# Input: scored_leads_for_closer.csv (first column = business name)

CSV="../PHYSICAL_OUTREACH_PROSPECTS.csv"
OUTPUT_DIR="./qr_previews"
mkdir -p "$OUTPUT_DIR"

# Generate QR codes for top 10 prospects
tail -n +2 "$CSV" | head -10 | while IFS=, read -r name city niche social gmb; do
    # Clean the name
    clean_name=$(echo "$name" | tr -d '"' | tr ' ' '_' | tr -cd '[:alnum:]_')
    
    # Generate a unique CCM landing URL for this prospect
    # In production, this would be a custom onboarding link
    landing_url="https://customercomebackmachine.com/welcome/${clean_name}"
    
    # Use Google Charts QR API
    qr_url="https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${landing_url}&choe=UTF-8"
    
    # Download the QR code
    curl -s "$qr_url" -o "${OUTPUT_DIR}/${clean_name}_qr.png"
    
    echo "✅ QR generated: ${clean_name} → ${OUTPUT_DIR}/${clean_name}_qr.png"
done

echo ""
echo "=== COMPLETE ==="
echo "Generated QR codes for top 10 prospects in ${OUTPUT_DIR}/"
ls -la "${OUTPUT_DIR}/"
