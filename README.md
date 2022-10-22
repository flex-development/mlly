# mlly

[![conventional commits](https://img.shields.io/badge/conventional%20commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![module type: esm](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![npm](https://img.shields.io/npm/v/@flex-development/mlly.svg)](https://npmjs.com/package/@flex-development/mlly)
[![license](https://img.shields.io/github/license/flex-development/mlly.svg)](LICENSE.md)
[![typescript](https://badgen.net/badge/-/typescript?color=2a72bc&icon=typescript&label)](https://typescriptlang.org)

> [ECMAScript module][1] utilities

## Install

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
   scope][2].

2. Run install command

   ```sh
   yarn add @flex-development/mlly
   ```

### Git

See [npm-install][3] or [Git - Protocols | Yarn][4] for details on requesting a
specific branch, commit, or tag.

#### NPM

```sh
npm i flex-development/mlly
```

#### Yarn

```sh
yarn add @flex-development/mlly@flex-development/mlly
```

## Usage

**TODO**: Update documentation.

[1]: https://nodejs.org/api/esm.html
[2]:
    https://docs.github.com/packages/learn-github-packages/about-permissions-for-github-packages#about-scopes-and-permissions-for-package-registries
[3]: https://docs.npmjs.com/cli/v8/commands/npm-install#description
[4]: https://yarnpkg.com/features/protocols#git
