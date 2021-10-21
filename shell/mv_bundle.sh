#!/bin/zsh

# Root folders
source variables.sh

MOVE_ADDITIO=false
MOVE_CENTERS=false

if [ $# -eq 0 ]; then
  MOVE_ADDITIO=true
  MOVE_CENTERS=true
else
  while getopts "ac" arg; do
    case $arg in
      a) # Bundle additio
        MOVE_ADDITIO=true
      ;;
      c) # Bundle centers
        MOVE_CENTERS=true
      ;;
      *) # Do nothing 
      ;;
    esac
  done
fi


# Copy additio-core bundle to Additio
mv_app() {
  [ ! -d $APP_SRC"/"$BOWER"/bundles/additio" ] && mkdir -p $APP_SRC"/"$BOWER"/bundles/additio"
  echo "\nCopying bundles & images to app... 🚚"
  cp -r $CORE"/bundles" $APP_SRC"/"$BOWER && echo "- Bundles copied ✅"
  cp -r $CORE"/bundles/additio/img/project-planner" $APP_SRC"/img" && echo "- Images copied ✅"
}
  
# Copy additio-core bundle to Centers
mv_centers() {
  [ ! -d $CENTERS_SRC"/"$BOWER"/bundles/additio" ] && mkdir -p $CENTERS_SRC"/"$BOWER"/bundles/additio"
  echo "\nCopying bundles & images to centers... 🚚"
  cp -r $CORE"/bundles" $CENTERS_SRC"/"$BOWER && echo "- Bundles copied ✅"
  cp -r $CORE"/bundles/additio/img/project-planner" $CENTERS_SRC"/img/" && echo "- Images copied ✅"
}

$MOVE_ADDITIO && mv_app
$MOVE_CENTERS && mv_centers

