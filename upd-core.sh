#!/bin/zsh

# Script that automates installing a version of the updated additio-core packages
# in app and centers

if [ -z "$1" ]; then
  echo "Usage: ./upd-core.sh <version>"
fi

echo "Updating additio-core version inside Additio... 🚀"

ROOT=$HOME"/Documents/additio-web/frontend"
URL="https://github.com/additio/additio-core.git#^"$1 
set -A PIDS

echo "  > Updating to "$1" version in app... 📦️"
(cd $ROOT"/app" && npx bower install --quiet "$URL" --save) &
PIDS+=($!)

echo "  > Updating to "$1" version in centers... 📦️"
(cd $ROOT"/centers" && npx bower install --quiet "$URL" --save) &
PIDS+=($!)

echo "Waiting for updates to complete... ⌛\n"
for pid in $PIDS; do
  wait $pid
done

echo "\nPackages updated successfully... 🚀"

