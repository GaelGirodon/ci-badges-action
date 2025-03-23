#!/usr/bin/env bash

set -ex && trap read debug

npx npm-check-updates -u
npm install
npm update
npm audit fix
npm run lint
npm run test
npm run build
