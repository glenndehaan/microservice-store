#!/bin/bash

WORKSPACE=$(pwd)

cd $WORKSPACE/api/cart && npm run dev & cd $WORKSPACE/api/content && npm run dev & cd $WORKSPACE/api/product && npm run dev & cd $WORKSPACE/api/search && npm run dev & cd $WORKSPACE/api/stock && npm run dev & cd $WORKSPACE/api/user && npm run dev & cd $WORKSPACE/api/wishlist && npm run dev & cd $WORKSPACE/storage && npm run dev & cd $WORKSPACE/pim && npm run dev & cd $WORKSPACE/web && npm run dev & cd $WORKSPACE/web && npm run webpack && kill $!
