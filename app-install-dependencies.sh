#!/bin/bash

WORKSPACE=$(pwd)
DIRS=( "$WORKSPACE/_defaults" "$WORKSPACE/api/cart" "$WORKSPACE/api/content" "$WORKSPACE/api/product" "$WORKSPACE/api/search" "$WORKSPACE/api/stock" "$WORKSPACE/api/user" "$WORKSPACE/api/wishlist" "$WORKSPACE/storage" "$WORKSPACE/pim" "$WORKSPACE/web" )

echo ""
echo "--------------------------------------------------------------"
echo "Installing dependencies. Hang on this can take a while...."
echo "--------------------------------------------------------------"
echo ""

for DIR in "${DIRS[@]}"
do
  echo ""
  echo "--------------------------------------------------------------"
  echo "Now installing: $DIR"
  echo "--------------------------------------------------------------"
  echo ""

	cd $DIR
	npm ci
done

echo ""
echo "--------------------------------------------------------------"
echo "Done !!!"
echo "--------------------------------------------------------------"
echo ""
