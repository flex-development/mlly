#!/bin/sh

# Local Release Workflow
#
# 1. run typecheck
# 2. run tests
# 3. pack project
# 4. run postbuild typecheck
# 5. analyze types
# 6. print package size report
# 7. build docs
# 8. get new package version
# 9. get release branch name
# 10. switch to release branch
# 11. stage changes
# 12. commit changes
# 13. push release branch to origin
# 14. create pull request
# 15. cleanup
#
# References:
#
# - https://cli.github.com/manual/gh_pr_create
# - https://github.com/arethetypeswrong/arethetypeswrong.github.io

yarn typecheck
yarn test:cov
yarn pack
yarn check:types:build
attw package.tgz
yarn pkg-size
yarn docs:build
VERSION=$(jq .version package.json -r)
RELEASE_BRANCH=release/$VERSION
git switch -c $RELEASE_BRANCH
git add .
git commit -s -m "release: $(jq .tagPrefix package.json -r)$VERSION"
git push origin -u --no-verify $RELEASE_BRANCH
gh pr create --assignee @me --label scope:release --web
yarn clean:pack
