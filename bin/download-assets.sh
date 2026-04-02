#!/bin/bash
# Downloads the threejscity/ directory from the images R2 bucket
# Requires: aws CLI configured with R2 credentials
# Setup: https://developers.cloudflare.com/r2/api/s3/tokens/

ACCOUNT_ID="${R2_ACCOUNT_ID}"
BUCKET="images"
PREFIX="threejscity/"
DEST="$(dirname "$0")/../threejscity"

aws s3 sync "s3://${BUCKET}/${PREFIX}" "${DEST}" \
  --endpoint-url "https://${ACCOUNT_ID}.r2.cloudflarestorage.com"
