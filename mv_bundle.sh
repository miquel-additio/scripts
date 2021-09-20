#!/bin/zsh

# Root folders
source variables.sh

# Copy additio-core bundle to Additio
[ ! -d $APP_SRC"/"$BOWER"/bundles/additio" ] && mkdir -p $APP_SRC"/"$BOWER"/bundles/additio"
echo "\nCopying bundles & images to app... 🚚"
cp -r $CORE"/bundles" $APP_SRC"/"$BOWER && echo "- Bundles copied ✅"
cp -r $CORE"/bundles/additio/img/project-planner" $APP_SRC"/img" && echo "- Images copied ✅"
  
# Copy additio-core bundle to Centers
[ ! -d $CENTERS_SRC"/"$BOWER"/bundles/additio" ] && mkdir -p $CENTERS_SRC"/"$BOWER"/bundles/additio"
echo "\nCopying bundles & images to centers... 🚚"
cp -r $CORE"/bundles" $CENTERS_SRC"/"$BOWER && echo "- Bundles copied ✅"
cp -r $CORE"/bundles/additio/img/project-planner" $CENTERS_SRC"/img/" && echo "- Images copied ✅"

