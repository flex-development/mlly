#!/bin/sh

# Local Release Workflow

# 1. run typecheck
# 2. run tests
# 3. pack project
# 4. build docs
# 5. get new package version
# 6. get release branch name
# 7. switch to release branch
# 8. stage changes
# 9. commit changes
# 10. push release branch to origin
# 11. cleanup

yarn typecheck
yarn test:cov
yarn pack -o %s-%v.tgz
yarn docs:build
VERSION=$(jq .version package.json -r)
RELEASE_BRANCH=release/$VERSION
git switch -c $RELEASE_BRANCH
git add .
git commit -s -m "release: $(jq .tagPrefix package.json -r)$VERSION" --no-verify
git push origin -u --no-verify $RELEASE_BRANCH
yarn clean:pack
