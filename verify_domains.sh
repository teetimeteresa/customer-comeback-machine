#!/bin/bash
# Verify websites and update enrichment with curl checks
OUTPUT="/tmp/domain_check.txt"
> "$OUTPUT"

echo "=== DOMAIN VERIFICATION ===" >> "$OUTPUT"

for domain in musiccityautorepair.com pawpleasersgrooming.com vibeyogastudio.com pridegroomscottsdale.com elitefinishauto.com culversautobody.com scottdaleautorepair.com eliteautowerks.com denverdoggrooming.com coloradoautorepair.com autowerkscharlotte.com radiantyogaaustin.com texasfrenchbread.com truehotyoga.com samadhiyoga.com jldesserts.com echocoffee.com bongojava.com siftbakeshop.com; do
  result=$(curl -sI --connect-timeout 3 "https://$domain" 2>&1 | head -1)
  echo "$domain: $result" >> "$OUTPUT"
done

echo "DONE"
cat "$OUTPUT"