#!/bin/zsh

# Root folders
source variables.sh

# Initialize
echo "Bundling additio-core to app & centers... 🚀"

# Compile the code in additio-core
(cd $CORE && npm run --silent buildAdditio) &
BUNDLE_PID=$!

# Remove the existing bundle in app
if [ -d $APP"/"$BOWER"/bundles/additio" ]; then
  echo "Removing additio bundle... 🧹"
  rm -rf $APP"/"$BOWER"/bundles/additio"
fi
if [ -d $APP"/img/project-planner" ]; then
  echo "Removing additio images... 🧹"
  rm -rf APP"/"$BOWER"/bundles/additio/img/project-planner" 
fi

# Remove the existing bundle in centers
if [ -d $CENTERS"/"$BOWER"/bundles/additio" ]; then
  echo "Removing centers bundle... 🧹"
  rm -rf $CENTERS"/"$BOWER"/bundles/additio"
fi
if [ -d $CENTERS"/img/project-planner" ]; then
  echo "Removing centers images... 🧹"
  rm -rf $CENTERS"/img/project-planner" 
fi

# Wait for bundle to finish
echo "Waiting for bundle to finish... 📦"
wait $BUNDLE_PID 

if [ -f "mv_bundle.sh" ]; then
  echo "\nRunning mv_bundle... 🚀"

  ./mv_bundle.sh
else
  echo "\nmv_bundle.sh is required to move the bundle 🔴"
fi
