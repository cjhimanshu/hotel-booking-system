#!/bin/sh
# Run this after cloning: sh scripts/setup-hooks.sh
# Installs the git pre-commit hook that prevents secrets from being committed.

HOOK_DIR=".git/hooks"
HOOK_SOURCE="scripts/pre-commit.hook"
HOOK_DEST="$HOOK_DIR/pre-commit"

if [ ! -d "$HOOK_DIR" ]; then
  echo "Error: Not in the root of a git repository."
  exit 1
fi

cp "$HOOK_SOURCE" "$HOOK_DEST"
chmod +x "$HOOK_DEST"
echo "Pre-commit hook installed successfully."
