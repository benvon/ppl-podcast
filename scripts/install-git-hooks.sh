#!/bin/sh
set -eu

repo_root=$(git rev-parse --show-toplevel)
cd "$repo_root"
git config --local core.hooksPath .githooks
printf '%s\n' "Configured this checkout to use .githooks."
