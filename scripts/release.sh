#!/bin/sh

# Local Release Workflow

# 1. run tests
# 2. build project
# 3. build docs
# 4. get new package version
# 5. get release branch name
# 6. switch to release branch
# 7. stage changes
# 8. commit changes
# 9. push release branch to origin

yarn test:cov
yarn build
yarn docs:build
VERSION=$(jq .version package.json -r)
RELEASE_BRANCH=release/$VERSION
git switch -c $RELEASE_BRANCH
git add .
git commit -s -m "release: $(jq .tagPrefix package.json -r)$VERSION" --no-verify
git push origin -u --no-verify $RELEASE_BRANCH
