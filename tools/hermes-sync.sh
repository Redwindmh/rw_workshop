#!/usr/bin/env bash
# Read-only Hermes observer for approved Redwind Workshop commits.
# Does not merge, check out, build, or deploy.
set -euo pipefail
if [[ $# -lt 1 ]]; then
  echo "Usage: bash tools/hermes-sync.sh /path/to/staging/checkout [state-directory]" >&2
  exit 2
fi
REPO_DIR="$1"
STATE_DIR="$HOME/.local/state/redwind-workshop"
if [[ $# -ge 2 ]]; then STATE_DIR="$2"; fi
STATE_FILE="$STATE_DIR/last-observed-master-sha"
TRACK_REF="refs/remotes/origin/master"

git -C "$REPO_DIR" rev-parse --show-toplevel >/dev/null 2>&1 || {
  echo "Expected a Git checkout" >&2
  exit 2
}
git -C "$REPO_DIR" remote get-url origin >/dev/null 2>&1 || {
  echo "No origin remote" >&2
  exit 2
}
git -C "$REPO_DIR" fetch --quiet --no-tags origin \
  '+refs/heads/master:refs/remotes/origin/master'
current="$(git -C "$REPO_DIR" rev-parse "$TRACK_REF")"
previous=""
if [[ -f "$STATE_FILE" ]]; then previous="$(cat "$STATE_FILE")"; fi

if [[ "$previous" == "$current" ]]; then
  echo "UNCHANGED $current"
  exit 0
fi
if [[ -z "$previous" ]]; then
  echo "INITIAL_OBSERVATION $current"
elif git -C "$REPO_DIR" cat-file -e "$previous^{commit}" 2>/dev/null &&
     git -C "$REPO_DIR" merge-base --is-ancestor "$previous" "$current"; then
  echo "UPDATED $previous -> $current"
  git -C "$REPO_DIR" log --format='%h %s' "$previous..$current"
  echo "Changed content:"
  git -C "$REPO_DIR" diff --name-only "$previous" "$current" -- src/content
else
  echo "HISTORY_CHANGED: manual review required" >&2
  exit 3
fi

# Observed is NOT deployed. Record observation atomically.
mkdir -p -- "$STATE_DIR"
temp="$(mktemp "$STATE_DIR/.observed.XXXXXX")"
trap 'rm -f -- "$temp"' EXIT
printf '%s\n' "$current" > "$temp"
mv -f -- "$temp" "$STATE_FILE"
