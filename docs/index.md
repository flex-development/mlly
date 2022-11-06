---
head:
  - - meta
    - name: keywords
      content:
        - ecmascript
        - es modules
        - esm
        - flex-development
        - node
        - typescript
        - utilities
---

# mlly

> [ECMAScript module][1] utilities

## Install

This package is **[ESM only][2]**.

```sh
yarn add @flex-development/mlly
```

### GitHub Package Registry

To install from the GitHub Package Registry:

1. Setup a `.npmrc` or `.yarnrc.yml` file to authenticate with the registry

   **`.npmrc`**

   ```ini
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   @flex-development:registry=https://npm.pkg.github.com/
   ```

   **`.yarnrc.yml`**

   ```yaml
   npmRegistries:
     //npm.pkg.github.com:
       npmAlwaysAuth: true
       npmAuthToken: ${GITHUB_TOKEN}

   npmScopes:
     flex-development:
       npmRegistryServer: https://npm.pkg.github.com
   ```

   where `GITHUB_TOKEN` is a [Personal Access Token with the `read:packages`
   scope][3].

2. Run install command

   ```sh
   yarn add @flex-development/mlly
   ```

### Git

<br/>

#### NPM

```sh
npm i flex-development/mlly
```

See [npm-install][4] for details on requesting a branch, commit, or tag.

#### Yarn

```sh
yarn add @flex-development/mlly@flex-development/mlly
```

See [Git - Protocols][5] for details on requesting a branch, commit, or tag.

[1]: https://nodejs.org/api/esm.html
[2]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[3]:
    https://docs.github.com/packages/learn-github-packages/about-permissions-for-github-packages#about-scopes-and-permissions-for-package-registries
[4]: https://docs.npmjs.com/cli/v8/commands/npm-install/#description
[5]: https://yarnpkg.com/features/protocols/#git
