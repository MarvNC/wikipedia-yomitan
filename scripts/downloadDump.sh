#!/bin/bash

# Check for two arguments: language (en, de, fr, ...) and date (yyyy.mm.dd)
if [ $# -ne 2 ]; then
  echo "Usage: $0 <language> <date>"
  exit 1
fi

URL="https://databus.dbpedia.org/dbpedia/text/short-abstracts/$2/short-abstracts_lang=$1.ttl.bzip2"
ARCHIVE="short-abstracts_lang=$1.ttl.bzip2"
FILE="short-abstracts_lang=$1.ttl"

# Download the archive if neither the file nor archive exists
if [ ! -f "$FILE" ] && [ ! -f "$ARCHIVE" ]; then
  echo "Downloading $URL"
  wget "$URL"
fi

# Extract the archive if it does not exist
if [ ! -f "$FILE" ]; then
  echo "Extracting $ARCHIVE"
  bzip2 -dc "$ARCHIVE" >"$FILE"
fi
