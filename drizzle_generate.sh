#!/bin/bash

# Deno環境ではdrizzle-kitがうまく動かないため、スクリプトで管理。dotenv入れて、npxでやれば動くかも。
set -a # automatically export all variables
source .env # load environment variables from .env file
set +a # stop automatically exporting
npx drizzle-kit generate --config src/infrastructure/adapters/orm/drizzle/drizzle.config.ts
