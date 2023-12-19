#!/bin/bash

# Check for two arguments: date (yyyy.mm.dd) and language (en, de, fr, ...)
if [ $# -ne 2 ]; then
  echo "Usage: $0 <date> <language>"
  exit 1
fi

URL="https://databus.dbpedia.org/dbpedia/text/short-abstracts/$1/short-abstracts_lang=$2.ttl.bzip2"
ARCHIVE="short-abstracts_lang=$2.ttl.bzip2"
FILE="short-abstracts_lang=$2.ttl"

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
