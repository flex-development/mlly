---
head:
  - - meta
    - name: keywords
      content:
        - ESM_RESOLVE
        - LOOKUP_PACKAGE_SCOPE
        - PACKAGE_EXPORTS_RESOLVE
        - PACKAGE_IMPORTS_EXPORTS_RESOLVE
        - PACKAGE_IMPORTS_RESOLVE
        - PACKAGE_RESOLVE
        - PACKAGE_SELF_RESOLVE
        - PACKAGE_TARGET_RESOLVE
        - PATTERN_KEY_COMPARE
        - READ_PACKAGE_JSON
        - ecmascript
        - es modules
        - esm
        - flex-development
        - node
        - resolution-algorithm
        - resolver-algorithm
        - typescript
        - utilities
---

# mlly

> :gear: [ECMAScript module][1] utilities

## What is this?

`mlly` is a set of [ECMAScript module][1] (ESM) utilities. It exposes several tools to bridge the gap between developer
experience and the current state of ECMAScript modules.

## Install

This package is **[ESM only][2]**.

```sh
yarn add @flex-development/mlly
```

## Using Unreleased Commits

If you can't wait for a new release to check out the latest features, you can clone the [`mlly` repo][3] to build from
source or install the project from Git.

### Build from Source

To build from source, you'll need a GitHub Personal Access Token named `GITHUB_TOKEN`. It should have [permissions for
downloading and install packages from GitHub Packages][4].

```sh
git clone https://github.com/flex-development/mlly
cd mlly
yarn install
yarn build
```

Afterwards, use your preferred package manager to link the build to your current project.

### Install from Git

```sh
yarn add @flex-development/mlly@flex-development/mlly
```

> See [npm-install][5] or [Git - Protocols][6] for details on requesting a branch, commit, or tag.

## Contribute

**Disclaimer**: This project has a [code of conduct][7]. By interacting with the project repository, organization, or
community, you agree to abide by its terms.

See [`CONTRIBUTING.md`][8] for details on contributing.

## License

[BSD 3-Clause][9] &copy; Flex Development

[1]: https://nodejs.org/api/esm.html
[2]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[3]: https://github.com/flex-development/mlly
[4]: https://docs.github.com/packages/learn-github-packages/about-permissions-for-github-packages#about-scopes-and-permissions-for-package-registries
[5]: https://docs.npmjs.com/cli/v8/commands/npm-install/#description
[6]: https://yarnpkg.com/features/protocols/#git
[7]: https://github.com/flex-development/mlly/blob/main/CODE_OF_CONDUCT.md
[8]: https://github.com/flex-development/mlly/blob/main/CONTRIBUTING.md
[9]: https://github.com/flex-development/mlly/blob/main/LICENSE.md
