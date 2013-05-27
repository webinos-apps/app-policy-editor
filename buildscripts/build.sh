#! /bin/sh

THIS_SCRIPT=./buildscripts/build.sh

UNSIGNED_APP=./build/policyeditor.wgt

if [ ! -f $THIS_SCRIPT ]; then 
    echo "This script has to be run from the app root directory"
    exit -1;
fi

if [ -e $UNSIGNED_APP ]; then 
    rm -v $UNSIGNED_APP
fi

# Zip all the html, javascript, CSS, images and other information.
zip -r $UNSIGNED_APP *.html *.js *.css ./fonts/* ./img/* ./certificates/*.pem config.xml -x ./webinos.js -x */*~


