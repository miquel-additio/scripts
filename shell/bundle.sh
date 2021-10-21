#!/bin/zsh

# Root folders
source variables.sh

BUNDLE_ADDITIO=false
BUNDLE_CENTERS=false

# Check params
if [ $# -eq 0 ]; then
  BUNDLE_ADDITIO=true
  BUNDLE_CENTERS=true
else
  while getopts "ac" arg; do
    case $arg in
      a) # Bundle additio
        BUNDLE_ADDITIO=true
        ;;
      c) # Bundle centers
        BUNDLE_CENTERS=true
        ;;
      *) # Do nothing 
        ;;
    esac
  done
fi

# Initialize
if $BUNDLE_ADDITIO && $BUNDLE_CENTERS; then
  echo "Bundling additio-core to app & centers... 🚀"
elif $BUNDLE_ADDITIO; then
  echo "Bundling additio-core to app... 🚀"
elif $BUNDLE_CENTERS; then
  echo "Bundling additio-core to centers... 🚀"
fi

# Compile the code in additio-core
(cd $CORE && npm run --silent buildAdditio) &
BUNDLE_PID=$!

# Remove the existing bundle in app
rm_bundle_app() {
  if [ -d $APP_SRC"/"$BOWER"/bundles/additio" ]; then
      echo "Removing additio bundle... 🧹"
    rm -rf $APP_SRC"/"$BOWER"/bundles/additio"
  fi

  if [ -d $APP_SRC"/img/project-planner" ]; then
      echo "Removing additio images... 🧹"
    rm -rf APP"/"$BOWER"/bundles/additio/img/project-planner" 
  fi
}

# Remove the existing bundle in centers
rm_bundle_centers() {
  if [ -d $CENTERS_SRC"/"$BOWER"/bundles/additio" ]; then
    echo "Removing centers bundle... 🧹"
    rm -rf $CENTERS_SRC"/"$BOWER"/bundles/additio"
  fi


  if [ -d $CENTERS_SRC"/img/project-planner" ]; then
    echo "Removing centers images... 🧹"
    rm -rf $CENTERS_SRC"/img/project-planner" 
  fi
}

$BUNDLE_ADDITIO && rm_bundle_app
$BUNDLE_CENTERS && rm_bundle_centers

# Wait for bundle to finish
echo "Waiting for bundle to finish... 📦"
wait $BUNDLE_PID 

if [ -f "mv_bundle.sh" ]; then
  echo "\nRunning mv_bundle... 🚀"

  if $BUNDLE_ADDITIO && $BUNDLE_CENTERS; then
    ./mv_bundle.sh -a -c
  elif $BUNDLE_ADDITIO; then 
    ./mv_bundle.sh -a
  elif $BUNDLE_CENTERS; then
    ./mv_bundle.sh -c
  fi
else
  echo "\nmv_bundle.sh is required to move the bundle 🔴"
fi

