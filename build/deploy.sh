#!/usr/bin/env sh

# abort on errors
set -e

# AFTER BUILD: navigate into the build output directory
cd dist
git init
git add -A
git commit -m 'deploying'
git push -f https://github.com/rsouverain/KORIAN_wifipass_autologin_userscript.git master:live
rm -rf .git
cd -
