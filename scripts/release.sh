#!/bin/sh

# Local Release Workflow

# 1. run typecheck
# 2. run tests
# 3. pack project
# 4. run check:types:build
# 5. build docs
# 6. get new package version
# 7. get release branch name
# 8. switch to release branch
# 9. stage changes
# 10. commit changes
# 11. push release branch to origin
# 12. cleanup

yarn typecheck
yarn test:cov
yarn pack -o %s-%v.tgz
yarn check:types:build
yarn docs:build
VERSION=$(jq .version package.json -r)
RELEASE_BRANCH=release/$VERSION
git switch -c $RELEASE_BRANCH
git add .
git commit -s -m "release: $(jq .tagPrefix package.json -r)$VERSION" --no-verify
git push origin -u --no-verify $RELEASE_BRANCH
yarn clean:pack
