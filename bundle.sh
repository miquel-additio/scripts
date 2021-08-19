#!/bin/zsh

# Root folders
ADDITIO=$HOME"/Documents/additio-web"
CORE=$HOME"/Documents/additio-core"
APP=$ADDITIO"/frontend/app/src"
CENTERS=$ADDITIO"/frontend/centers/src"
BOWER="bower_components/additio-core"

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

# Copy bundle to app
[ ! -d $APP"/"$BOWER"/bundles/additio" ] && mkdir -p $APP"/"$BOWER"/bundles/additio"
echo "\nCopying bundles & images to app... 🚚"
cp -r $CORE"/bundles" $APP"/"$BOWER && echo "- Bundles copied ✅"
cp -r $CORE"/bundles/additio/img/project-planner" $APP"/img" && echo "- Images copied ✅"

[ ! -d $CENTERS"/"$BOWER"/bundles/additio" ] && mkdir -p $CENTERS"/"$BOWER"/bundles/additio"
echo "\nCopying bundles & images to centers... 🚚"
cp -r $CORE"/bundles" $CENTERS"/"$BOWER && echo "- Bundles copied ✅"
cp -r $CORE"/bundles/additio/img/project-planner" $CENTERS"/img/" && echo "- Images copied ✅"

