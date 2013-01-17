#! /bin/sh

# This is just a convenience script for the Java signing tool at:
# https://github.com/paddybyers/widgetsigner

# Where is the Java signing tool?
JAVA_SIGNER=../widgetsigner/out/widgetsigner.jar

# Where are the author keys?
AUTHOR_P12=./keys/author.p12

# What is the author's password to the private key?
AUTHOR_PASSWORD=

# What is the entry name of the author in the author key PKCS file?
AUTHOR_ENTRY_NAME=

# What are we signing?
WIDGET_PATH=./build/policyeditor.wgt

echo "------------------------------"
echo "  Creating author signature   "
echo "------------------------------"

java -jar $JAVA_SIGNER -w $WIDGET_PATH -k $AUTHOR_P12 -p $AUTHOR_PASSWORD -a $AUTHOR_ENTRY_NAME -s 0

if [ $? -ne 0 ]; then
  echo "Failed to create author signatures"
  exit 500
fi


