#!/bin/bash

langs=("ja" "zh")
date_val="2022-12-01"

# Format date for file naming
dateFile=$(date -d "$date_val" +"%Y.%m.%d")

# Output array and dateFile
echo "langs array: ${langs[@]}"
echo "date_val variable: $date_val"
echo "dateFile variable: $dateFile"

# For each lang, run downloadDump.sh with <lang> <dateFile>
for lang in "${langs[@]}"; do
  echo "Running downloadDump.sh with $lang and $dateFile"
  ./scripts/downloadDump.sh "$lang" "$dateFile"
done

# Run node src/convertWikipedia.js with <lang> <date_val> for each lang
for lang in "${langs[@]}"; do
  echo "Running convertWikipedia.js with $lang and $date_val"
  node src/convertWikipedia.js "$lang" "$date_val"
done
