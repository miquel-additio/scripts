#!/bin/zsh

# Root folders
source variables.sh

ONESKY="npx gulp onesky"
set -A PIDS

# Initialize
echo "Syncronising OneSky internationalisation... 🚀"

# Run it on every frontend folder
if [ -d $APP ]; then
  echo "Translatting Addiito... 🏁"
  (cd $APP && npx gulp onesky --silent) &
  PIDS+=($!)
fi

if [ -d $APP ]; then
  echo "Translatting Centers... 🏁"
  (cd $CENTERS && npx gulp onesky --silent) &
  PIDS+=($!)
fi

if [ -d $EDVOICE ]; then
  echo "Translatting Edvoice... 🏁"
  (cd $EDVOICE && npx gulp onesky --silent) &
  PIDS+=($!)
fi

echo "Waiting translations to finish... ⏳"
wait $BUNDLE_PID

echo "Projects translated! 🚀"