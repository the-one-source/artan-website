#!/bin/bash
set -euo pipefail

VAULT="$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/I/11_Publish"
DEST="$HOME/Library/Mobile Documents/com~apple~CloudDocs/Documents/Site/artan-website/content_sync"

mkdir -p "$DEST"
rsync -av --delete \
  --exclude ".DO_NOT_EDIT" \
  --exclude "README.md" \
  "$VAULT"/ "$DEST"/
