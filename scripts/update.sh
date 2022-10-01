#!/usr/bin/env bash

set -e
set -x
trap read debug

npx npm-check-updates -u
npm install
npm audit fix
npm update
npm run lint
npm run test
npm run build
