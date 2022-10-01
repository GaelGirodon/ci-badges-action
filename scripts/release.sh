#!/usr/bin/env bash

set -e
set -x
trap read debug

# Release X.Y.Z on the main branch
git switch main
echo "Update version number and changelog..."
npm install
version="$(grep -oE '[0-9.]{5,}' package.json | head -n 1)"
major="$(echo "$version" | cut -c1)"
echo "Releasing $version (v$major)"
sed -E -i "s/action@v[0-9.]+/action@v$major/" .github/workflows/check-release.yml
git add package*.json .github CHANGELOG.md
git commit -m "Release $version"
git tag -a "$version" -m "$version"

# Release vX.Y.Z with dist/ folder on the release branch
git switch release
rm -rf ./dist
git checkout main -- .
npm run build
sed -i '0,/index.js/s//dist\/index.js/' action.yml package.json
sed -i '/dist\//d' .gitignore
git add .
git commit -m "Release v$version"
git tag -a "v$version" -m "v$version"
git tag -a "v$major" -m "v$major" -f # Move the major version tag
