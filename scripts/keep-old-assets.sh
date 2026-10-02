#!/usr/bin/env bash
# Copies the hashed /_astro files of the last N deployed versions into dist/_astro.
# Usage: bash scripts/keep-old-assets.sh [N]   (default: 10; run after `bun run build`)
#
# Each deploy renames the JS/CSS chunks and Pages only serves the new artifact,
# so a page cached by a browser (Chrome on iOS holds on to them) would 404 on
# every island script and render blank. Builds are deterministic, so rebuilding
# recent commits brings their chunks back and stale pages keep working.
set -uo pipefail

n="${1:-10}"
out="$PWD/dist/_astro"

for sha in $(git rev-list --first-parent --skip=1 --max-count="$n" HEAD); do
  dir="$(mktemp -d)"
  git worktree add --quiet --detach "$dir" "$sha"
  if (cd "$dir" && bun install --frozen-lockfile >/dev/null 2>&1 && bun run build >/dev/null 2>&1); then
    cp -n "$dir"/dist/_astro/* "$out"/ 2>/dev/null
    echo "kept assets from ${sha:0:7}"
  else
    echo "skipped ${sha:0:7} (build failed)"
  fi
  git worktree remove --force "$dir"
done
