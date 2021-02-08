#!/usr/bin/env bash

if [[ "$NODE_ENV" == "development" ]]; then
  npm run dev
else
  npm run build
  npm run start
fi
