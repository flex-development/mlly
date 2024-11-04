# \:gear: mlly

[![github release](https://img.shields.io/github/v/release/flex-development/mlly.svg?include_prereleases\&sort=semver)](https://github.com/flex-development/mlly/releases/latest)
[![npm](https://img.shields.io/npm/v/@flex-development/mlly.svg)](https://npmjs.com/package/@flex-development/mlly)
[![codecov](https://codecov.io/gh/flex-development/mlly/graph/badge.svg?token=36NUNRH6FW)](https://codecov.io/gh/flex-development/mlly)
[![module type: esm](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![license](https://img.shields.io/github/license/flex-development/mlly.svg)](LICENSE.md)
[![conventional commits](https://img.shields.io/badge/-conventional%20commits-fe5196?logo=conventional-commits\&logoColor=ffffff)](https://conventionalcommits.org)
[![typescript](https://img.shields.io/badge/-typescript-3178c6?logo=typescript\&logoColor=ffffff)](https://typescriptlang.org)
[![vitest](https://img.shields.io/badge/-vitest-6e9f18?style=flat\&logo=vitest\&logoColor=ffffff)](https://vitest.dev)
[![yarn](https://img.shields.io/badge/-yarn-2c8ebb?style=flat\&logo=yarn\&logoColor=ffffff)](https://yarnpkg.com)

[ECMAScript module][node-esm] utilities.

## Contents

- [What is this?](#what-is-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
- [Types](#types)
- [Contribute](#contribute)

## What is this?

`mlly` is a set of [ECMAScript module][node-esm] (ESM) utilities. It exposes several tools to bridge the gap between
developer experience and the current state of ECMAScript modules.

## Install

This package is [ESM only][esm].

In Node.js (version 18+) with [yarn][]:

```sh
yarn add @flex-development/mlly
```

<blockquote>
  <small>
    See <a href='https://yarnpkg.com/protocol/git'>Git - Protocols | Yarn</a>
    &nbsp;for details regarding installing from Git.
  </small>
</blockquote>

In Deno with [`esm.sh`][esmsh]:

```ts
import { resolveModule } from 'https://esm.sh/@flex-development/mlly'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import { resolveModule } from 'https://esm.sh/@flex-development/mlly'
</script>
```

## Use

```js
import {
  canParseUrl,
  cwd,
  defaultConditions,
  defaultExtensions,
  defaultMainFields,
  extensionFormatMap,
  formats,
  getSource,
  isAbsoluteSpecifier,
  isArrayIndex,
  isBareSpecifier,
  isDirectory,
  isFile,
  isImportsSubpath,
  isRelativeSpecifier,
  legacyMainResolve,
  lookupPackageScope,
  moduleResolve,
  packageExportsResolve,
  packageImportsExportsResolve,
  packageImportsResolve,
  packageResolve,
  packageSelfResolve,
  packageTargetResolve,
  patternKeyCompare,
  patternMatch,
  readPackageJson,
  resolveAlias,
  resolveModule,
  resolver,
  root,
  toRelativeSpecifier,
  toUrl
} from '@flex-development/mlly'
```

## API

This package exports the following identifiers:

- [`canParseUrl`](./src/lib/can-parse-url.mts)
- [`cwd`](./src/lib/cwd.mts)
- [`defaultConditions`](./src/lib/default-conditions.mts)
- [`defaultExtensions`](./src/lib/default-extensions.mts)
- [`defaultMainFields`](./src/lib/default-main-fields.mts)
- [`extensionFormatMap`](./src/lib/extension-format-map.mts)
- [`formats`](./src/lib/formats.mts)
- [`getSource`](./src/lib/get-source.mts)
- [`isAbsoluteSpecifier`](./src/lib/is-absolute-specifier.mts)
- [`isArrayIndex`](./src/lib/is-array-index.mts)
- [`isBareSpecifier`](./src/lib/is-bare-specifier.mts)
- [`isDirectory`](./src/lib/is-directory.mts)
- [`isFile`](./src/lib/is-file.mts)
- [`isImportsSubpath`](./src/lib/is-imports-subpath.mts)
- [`isRelativeSpecifier`](./src/lib/is-relative-specifier.mts)
- [`lookupPackageScope`](./src/lib/lookup-package-scope.mts)
- [`patternKeyCompare`](./src/lib/pattern-key-compare.mts)
- [`patternMatch`](./src/lib/pattern-match.mts)
- [`readPackageJson`](./src/lib/read-package-json.mts)
- [`resolveAlias`](./src/lib/resolve-alias.mts)
- [`resolveModule`](./src/lib/resolve-module.mts)
- [`resolver`](./src/lib/resolver.mts)
  - `legacyMainResolve`
  - `moduleResolve`
  - `packageExportsResolve`
  - `packageImportsExportsResolve`
  - `packageImportsResolve`
  - `packageResolve`
  - `packageSelfResolve`
  - `packageTargetResolve`
- [`root`](./src/lib/root.mts)
- [`toRelativeSpecifier`](./src/lib/to-relative-specifier.mts)
- [`toUrl`](./src/lib/to-url.mts)

There is no default export.

## Types

This package is fully typed with [TypeScript][].

### Interfaces

- [`Aliases`](src/interfaces/aliases.mts)
- [`FileSystem`](src/interfaces/file-system.mts)
- [`MainFieldMap`](src/interfaces/main-field-map.mts)
- [`ModuleFormatMap`](src/interfaces/module-format-map.mts)
- [`ResolveAliasOptions`](src/interfaces/options-resolve-alias.mts)
- [`ResolveModuleOptions`](src/interfaces/options-resolve-module.mts)
- [`ProtocolMap`](src/interfaces/protocol-map.mts)
- [`Stats`](src/interfaces/stats.mts)

### Type Aliases

- [`ChangeExtFn`](src/types/change-ext-fn.mts)
- [`MainField`](src/types/main-field.mts)
- [`ModuleFormat`](src/types/module-format.mts)
- [`ModuleId`](src/types/module-id.mts)
- [`Numeric`](src/types/numeric.mts)
- [`PatternKeyCompareResult`](src/types/pattern-key-compare-result.mts)
- [`PatternMatch`](src/types/pattern-match.mts)
- [`Protocol`](src/types/protocol.mts)

## Contribute

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

This project has a [code of conduct](./CODE_OF_CONDUCT.md). By interacting with this repository, organization, or
community you agree to abide by its terms.

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[node-esm]: https://nodejs.org/api/esm.html

[typescript]: https://www.typescriptlang.org

[yarn]: https://yarnpkg.com
