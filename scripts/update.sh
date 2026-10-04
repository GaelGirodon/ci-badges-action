#!/usr/bin/env bash

set -ex && trap read debug

npx --min-release-age 7 npm-check-updates -u -c 3d
npm install
npm update --min-release-age 3
npm audit fix
npm run lint
npm run test
npm run build
