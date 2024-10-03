#!/bin/sh

set -e

# Local Release Workflow
#
# 1. run typecheck
# 2. run tests
# 3. pack project
# 4. run postbuild typecheck
# 5. analyze types
# 6. create release chore commit
# 7. cleanup
#
# References:
#
# - https://git-scm.com/docs/git-commit
# - https://github.com/flex-development/grease
# - https://jqlang.github.io

yarn typecheck
yarn test:cov
yarn pack
yarn check:types:build
attw package.tgz
git commit --allow-empty -S -s -m "release(chore): $(jq .version -r <<<$(grease bump -j $@))"
yarn clean:pack
