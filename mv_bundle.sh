#!/bin/zsh

# Root folders
source variables.sh

# Copy additio-core bundle to Additio
[ ! -d $APP"/"$BOWER"/bundles/additio" ] && mkdir -p $APP"/"$BOWER"/bundles/additio"
echo "\nCopying bundles & images to app... 🚚"
cp -r $CORE"/bundles" $APP"/"$BOWER && echo "- Bundles copied ✅"
cp -r $CORE"/bundles/additio/img/project-planner" $APP"/img" && echo "- Images copied ✅"
  
# Copy additio-core bundle to Centers
[ ! -d $CENTERS"/"$BOWER"/bundles/additio" ] && mkdir -p $CENTERS"/"$BOWER"/bundles/additio"
echo "\nCopying bundles & images to centers... 🚚"
cp -r $CORE"/bundles" $CENTERS"/"$BOWER && echo "- Bundles copied ✅"
cp -r $CORE"/bundles/additio/img/project-planner" $CENTERS"/img/" && echo "- Images copied ✅"

