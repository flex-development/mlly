# \:gear: mlly

[![github release](https://img.shields.io/github/v/release/flex-development/mlly.svg?include_prereleases\&sort=semver)](https://github.com/flex-development/mlly/releases/latest)
[![npm](https://img.shields.io/npm/v/@flex-development/mlly.svg)](https://npmjs.com/package/@flex-development/mlly)
[![npm downloads](https://img.shields.io/npm/dm/@flex-development/mlly.svg)](https://www.npmcharts.com/compare/@flex-development/mlly?interval=30)
[![install size](https://packagephobia.now.sh/badge?p=@flex-development/mlly)](https://packagephobia.now.sh/result?p=@flex-development/mlly)
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
  - [`canParseUrl(input[, base])`](#canparseurlinput-base)
  - [`cwd()`](#cwd)
  - [`defaultConditions`](#defaultconditions)
  - [`defaultExtensions`](#defaultextensions)
  - [`defaultMainFields`](#defaultmainfields)
  - [`extensionFormatMap`](#extensionformatmap)
  - [`formats`](#formats)
  - [`getSource<T>(id[, options])`](#getsourcetid-options)
  - [`isAbsoluteSpecifier(value)`](#isabsolutespecifiervalue)
  - [`isArrayIndex(value)`](#isarrayindexvalue)
  - [`isBareSpecifier(value)`](#isbarespecifiervalue)
  - [`isDirectory<T>(id[, fs])`](#isdirectorytid-fs)
  - [`isFile<T>(id[, fs])`](#isfiletid-fs)
  - [`isImportsSubpath(value)`](#isimportssubpathvalue)
  - [`isModuleId(value)`](#ismoduleidvalue)
  - [`isRelativeSpecifier(value)`](#isrelativespecifiervalue)
  - [`legacyMainResolve<T>(packageUrl[, manifest][, mainFields][, parent][, fs])`](#legacymainresolvetpackageurl-manifest-mainfields-parent-fs)
  - [`lookupPackageScope<T>(url[, end][, fs])`](#lookuppackagescopeturl-end-fs)
  - [`moduleResolve<T>(specifier, parent[, conditions][, mainFields][, preserveSymlinks][, fs])`](#moduleresolvetspecifier-parent-conditions-mainfields-preservesymlinks-fs)
  - [`packageExportsResolve<T>(packageUrl, subpath, exports[, conditions][, parent][, fs])`](#packageexportsresolvetpackageurl-subpath-exports-conditions-parent-fs)
  - [`packageImportsExportsResolve<T>(matchKey, matchObject, packageUrl[, isImports][, conditions][, mainFields][, parent][, fs])`](#packageimportsexportsresolvetmatchkey-matchobject-packageurl-isimports-conditions-mainfields-parent-fs)
  - [`packageImportsResolve<T>(specifier, parent[, conditions][, mainFields][, fs])`](#packageimportsresolvetspecifier-parent-conditions-mainfields-fs)
  - [`packageResolve<T>(specifier, parent[, conditions][, mainFields][, fs])`](#packageresolvetspecifier-parent-conditions-mainfields-fs)
  - [`packageSelfResolve<T>(name, subpath, parent[, conditions][, fs])`](#packageselfresolvetname-subpath-parent-conditions-fs)
  - [`packageTargetResolve<T>(packageUrl, target, subpath[, patternMatch][, isImports][, conditions][, mainFields][, parent][, fs])`](#packagetargetresolvetpackageurl-target-subpath-patternmatch-isimports-conditions-mainfields-parent-fs)
  - [`patternKeyCompare(a, b)`](#patternkeycomparea-b)
  - [`patternMatch(matchKey, matchObject)`](#patternmatchmatchkey-matchobject)
  - [`readPackageJson<T>(id[, specifier][, parent][, fs])`](#readpackagejsontid-specifier-parent-fs)
  - [`resolveAlias(specifier[, options])`](#resolvealiasspecifier-options)
  - [`resolveModule<T>(specifier, parent[, options])`](#resolvemoduletspecifier-parent-options)
  - [`resolver`](#resolver)
  - [`root`](#root)
  - [`toRelativeSpecifier(url, parent)`](#torelativespecifierurl-parent)
  - [`toUrl(id[, parent])`](#tourlid-parent)
- [Types](#types)
  - [`Aliases`](#aliases)
  - [`Awaitable<T>`](#awaitablet)
  - [`BufferEncodingMap`](#bufferencodingmap)
  - [`BufferEncoding`](#bufferencoding)
  - [`ChangeExtFn<[Ext]>`](#changeextfnext)
  - [`ConditionMap`](#conditionmap)
  - [`Condition`](#condition)
  - [`Dot`](#dot)
  - [`EmptyArray`](#emptyarray)
  - [`EmptyObject`](#emptyobject)
  - [`EmptyString`](#emptystring)
  - [`Ext`](#ext)
  - [`FileContent`](#filecontent)
  - [`FileSystem`](#filesystem)
  - [`GetSourceContext`](#getsourcecontext)
  - [`GetSourceHandler`](#getsourcehandler)
  - [`GetSourceHandlers`](#getsourcehandlers)
  - [`GetSourceOptions`](#getsourceoptions)
  - [`IsDirectory`](#isdirectory)
  - [`IsFile`](#isfile)
  - [`List<[T]>`](#listt)
  - [`MainFieldMap`](#mainfieldmap)
  - [`MainField`](#mainfield)
  - [`ModuleFormatMap`](#moduleformatmap)
  - [`ModuleFormat`](#moduleformat)
  - [`ModuleId`](#moduleid)
  - [`Numeric`](#numeric)
  - [`PatternKeyComparisonMap`](#patternkeycomparsionmap)
  - [`PatternKeyComparison`](#patternkeycomparsion)
  - [`PatternMatch`](#patternmatch)
  - [`ProtocolMap`](#protocolmap)
  - [`Protocol`](#protocol)
  - [`ReadFile<[T]>`](#readfilet)
  - [`Realpath<[T]>`](#realpatht)
  - [`ResolveAliasOptions`](#resolvealiasoptions)
  - [`ResolveModuleOptions`](#resolvemoduleoptions)
  - [`Stat<[T]>`](#statt)
  - [`Stats`](#stats)
- Additional Documentation
  - [Resolution Algorithm](./docs/resolution-algorithm.md)
- [Contribute](#contribute)

## What is this?

`mlly` is a set of [ECMAScript module][node-esm] (ESM) utilities.\
It exposes several tools to bridge the gap between developer experience and the current state of ECMAScript modules.

## Install

This package is [ESM only][esm].

In Node.js (version 20+) with [yarn][]:

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

```ts
import {
  lookupPackageScope,
  readPackageJson,
  resolveModule,
  type FileSystem
} from '@flex-development/mlly'
import pkg from '@flex-development/mlly/package.json' with { type: 'json' }
import type { PackageJson } from '@flex-development/pkg-types'
import nfs from 'node:fs'

/**
 * A file system API with both asynchronous and synchronous methods.
 *
 * @const {FileSystem} fs
 */
const fs: FileSystem = {
  readFile: nfs.promises.readFile,
  realpath: nfs.promises.realpath,
  stat: nfs.statSync
}

/**
 * The URL of the package directory.
 *
 * @const {URL | null} scope
 */
const scope: URL | null = lookupPackageScope(import.meta.url, null, fs)

console.dir(scope) // file:///Users/lex/Projects/flex-development/mlly/

/**
 * The package manifest.
 *
 * @const {PackageJson | null} manifest
 */
const manifest: PackageJson | null = await readPackageJson(
  scope,
  null,
  import.meta.url,
  fs
)

console.dir(manifest?.name === pkg.name) // true
console.dir(manifest) // `pkg`

/**
 * A fully resolved URL.
 *
 * @const {URL} resolved
 */
const resolved = resolveModule(pkg.name, import.meta.url, {
  conditions: new Set(['mlly']),
  ext: null
})

console.dir(resolved) // file:///Users/lex/Projects/flex-development/mlly/src/
```

## API

`mlly` exports the identifiers listed below.

There is no default export.

### `canParseUrl(input[, base])`

Check if `input` can be parsed to a `URL`.

> 👉 **Note**: If `input` is relative, `base` is required.
> If `input` is absolute, `base` is ignored.

#### Parameters

- `id` (`unknown`)
  — the input url
- `base` (`unknown`)
  — the base url to resolve against if `input` is not absolute

#### Returns

(`boolean`) `true` if `input` can be parsed to a `URL`, `false` otherwise

### `cwd()`

Get the URL of the current working directory.

#### Returns

(`URL`) The current working directory URL

### `defaultConditions`

[`Set<Condition>`](#condition)

The default list of conditions.

### `defaultExtensions`

[`Set<Ext>`](#ext)

The default list of resolvable file extensions.

### `defaultMainFields`

[`Set<MainField>`](#mainfield)

The default list of main fields.

### `extensionFormatMap`

`Map<Ext, ModuleFormat>`

Map, where each key is a [file extension](#ext) and each value is a default [module format](#formats).

### `formats`

Default module formats (`const enum`).

```ts
const enum formats {
  builtin = 'builtin',
  commonjs = 'commonjs',
  cts = 'commonjs-typescript',
  json = 'json',
  module = 'module',
  mts = 'module-typescript',
  wasm = 'wasm'
}
```

### `getSource<T>(id[, options])`

Get the source code for a module.

> 👉 **Note**: Returns a promise if the [handler](#getsourcehandler) for `id` is async.

#### Type Parameters

- `T` ([`Awaitable<FileContent | null | undefined>`](#filecontent))
  — the module source code

#### Parameters

- `id` ([`ModuleId`](#moduleid) | `null` | `undefined`)
  — the module id
- `options` ([`GetSourceOptions`](#getsourceoptions) | `null` | `undefined`)
  — source code retrieval options

#### Returns

(`T`) The module source code

#### Throws

- [`ERR_UNSUPPORTED_ESM_URL_SCHEME`][err-unsupported-esm-url-scheme]

### `isAbsoluteSpecifier(value)`

Check if `value` is an *absolute specifier*.

> 👉 **Note**: Only checks specifier syntax.\
> Does **not** guarantee the specifier references an existing module.

#### Parameters

- `value` (`unknown`)
  — the value to check

#### Returns

(`boolean`) `true` if `value` is absolute specifier, `false` otherwise

### `isArrayIndex(value)`

Check if `value` is a valid array index.

#### Parameters

- `value` (`unknown`)
  — the value to check

#### Returns

([`value is Numeric`](#numeric)) `true` if `value` is valid array index, `false` otherwise

### `isBareSpecifier(value)`

Check if `value` is a *bare specifier*.

> 👉 **Note**: Only checks specifier syntax.\
> Does **not** guarantee the specifier references an existing module.

#### Parameters

- `value` (`unknown`)
  — the value to check

#### Returns

(`boolean`) `true` if `value` is bare specifier, `false` otherwise

### `isDirectory<T>(id[, fs])`

Check if a directory exists.

> 👉 **Note**: Returns a promise if `fs.stat` is async.

#### Type Parameters

- `T` ([`Awaitable<boolean>`](#awaitablet))
  — the result of the check

#### Parameters

- `id` ([`ModuleId`](#moduleid))
  — the module id to check
- `fs` ([`FileSystem`](#filesystem) | `null` | `undefined`)
  — the file system api

#### Returns

(`T`) `true` if directory exists at `id`, `false` otherwise

### `isFile<T>(id[, fs])`

Check if a file exists.

> 👉 **Note**: Returns a promise if `fs.stat` is async.

#### Type Parameters

- `T` ([`Awaitable<boolean>`](#awaitablet))
  — the result of the check

#### Parameters

- `id` ([`ModuleId`](#moduleid))
  — the module id to check
- `fs` ([`FileSystem`](#filesystem) | `null` | `undefined`)
  — the file system api

#### Returns

(`T`) `true` if file exists at `id`, `false` otherwise

### `isImportsSubpath(value)`

Check if `value` is an [`imports`][subpath-imports] subpath.

> 👉 **Note**: Only checks specifier syntax.\
> Does **not** guarantee the specifier references an existing module.

#### Parameters

- `value` (`unknown`)
  — the value to check

#### Returns

([`value is ImportsSubpath`][pkg-imports-subpath]) `true` if `value` is `imports` subpath, `false` otherwise

### `isModuleId(value)`

Check if `value` is a module id.

#### Parameters

- `value` (`unknown`)
  — the value to check

#### Returns

([`value is ModuleId`](#moduleid)) `true` if `value` is module id, `false` otherwise

### `isRelativeSpecifier(value)`

Check if `value` is a *relative specifier*.

> 👉 **Note**: Only checks specifier syntax.\
> Does **not** guarantee the specifier references an existing module.

#### Parameters

- `value` (`unknown`)
  — the value to check

#### Returns

(`boolean`) `true` if `value` is relative specifier, `false` otherwise

<!--lint disable-->

### `legacyMainResolve<T>(packageUrl[, manifest][, mainFields][, parent][, fs])`

<!--lint enable-->

Resolve a [`main`][main]-like package entry point.

Implements the [`LEGACY_MAIN_RESOLVE`][algorithm-legacy-main-resolve] resolution algorithm.

> 👉 **Note**: Returns a promise if `fs.stat` is async.

#### Type Parameters

- `T` ([`Awaitable<URL>`](#awaitablet))
  — the resolved entry point url

#### Parameters

- `packageUrl` ([`ModuleId`](#moduleid))
  — the url of the package directory, the `package.json` file, or a module in the same directory as a `package.json`
- `manifest` ([`PackageJson`][pkg-package-json] | `null` | `undefined`)
  — the package manifest
- `mainFields` ([`List<MainField>`](#mainfield) | `null` | `undefined`)
  — the list of legacy main fields
  - **default**: [`defaultMainFields`](#defaultmainfields)
- `parent` ([`ModuleId`](#moduleid) | `null` | `undefined`)
  — the url of the parent module
- `fs` ([`FileSystem`](#filesystem) | `null` | `undefined`)
  — the file system api

#### Returns

(`T`) The resolved entry point URL

#### Throws

- [`ERR_MODULE_NOT_FOUND`][err-module-not-found]

### `lookupPackageScope<T>(url[, end][, fs])`

Get the package scope URL for a module `url`.

Implements the [`LOOKUP_PACKAGE_SCOPE`][algorithm-lookup-package-scope] algorithm.

> 👉 **Note**: Returns a promise if `fs.stat` is async.

#### Overloads

```ts
function lookupPackageScope(
  this: void,
  url: EmptyString | null | undefined,
  end?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): null
```

```ts
function lookupPackageScope<T extends Awaitable<URL | null>>(
  this: void,
  url: ModuleId | null | undefined,
  end?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): T
```

#### Type Parameters

- `T` ([`Awaitable<URL | null>`](#awaitablet))
  — the resolved package scope url

#### Parameters

- `id` ([`ModuleId`](#moduleid) | `null` | `undefined`)
  — the url of the module to scope
- `end` ([`ModuleId`](#moduleid) | `null` | `undefined`)
  — the url of the directory to end search at
  - **default**: [`root`](#root)
- `fs` ([`FileSystem`](#filesystem) | `null` | `undefined`)
  — the file system api

#### Returns

(`T`) The URL of nearest directory containing a `package.json` file

<!--lint disable-->

### `moduleResolve<T>(specifier, parent[, conditions][, mainFields][, preserveSymlinks][, fs])`

<!--lint enable-->

Resolve a module `specifier`.

Implements the [`ESM_RESOLVE`][algorithm-esm-resolve] algorithm.

> 👉 **Note**: Returns a promise if `fs.realpath` or `fs.stat` is async, or one the following methods returns a promise:
> [`packageImportsResolve`](#packageimportsresolvetspecifier-parent-conditions-mainfields-fs),
> [`packageResolve`](#packageresolvetspecifier-parent-conditions-mainfields-fs).

#### Type Parameters

- `T` ([`Awaitable<URL>`](#awaitablet))
  — the resolved url

#### Parameters

- `specifier` (`string`)
  — the module specifier to resolve
- `parent` ([`ModuleId`](#moduleid))
  — the url of the parent module
- `conditions` ([`List<Condition>`](#condition) | `null` | `undefined`)
  — the list of export/import conditions
  - **default**: [`defaultConditions`](#defaultconditions)
- `mainFields` ([`List<MainField>`](#mainfield) | `null` | `undefined`)
  — the list of legacy main fields
  - **default**: [`defaultMainFields`](#defaultmainfields)
- `preserveSymlinks` (`boolean` | `null` | `undefined`)
  — whether to keep symlinks instead of resolving them
- `fs` ([`FileSystem`](#filesystem) | `null` | `undefined`)
  — the file system api

#### Returns

(`T`) The resolved URL

<!--lint disable-->

### `packageExportsResolve<T>(packageUrl, subpath, exports[, conditions][, parent][, fs])`

<!--lint enable-->

Resolve a package export.

Implements the [`PACKAGE_EXPORTS_RESOLVE`][algorithm-package-exports-resolve] algorithm.

> 👉 **Note**: Never returns a promisee.

#### Type Parameters

- `T` ([`Awaitable<URL>`](#awaitablet))
  — the resolved package export url

#### Parameters

- `packageUrl` ([`ModuleId`](#moduleid))
  — the url of the package directory, the `package.json` file, or a module in the same directory as a `package.json`
- `subpath` (`string`)
  — the package subpath
- `exports` ([`Exports`][pkg-exports] | `undefined`)
  — the package exports
- `conditions` ([`List<Condition>`](#condition) | `null` | `undefined`)
  — the list of export/import conditions
  - **default**: [`defaultConditions`](#defaultconditions)
- `parent` ([`ModuleId`](#moduleid) | `null` | `undefined`)
  — the url of the parent module
- `fs` ([`FileSystem`](#filesystem) | `null` | `undefined`)
  — the file system api

#### Returns

(`T`) The resolved package export URL

<!--lint disable-->

### `packageImportsExportsResolve<T>(matchKey, matchObject, packageUrl[, isImports][, conditions][, mainFields][, parent][, fs])`

<!--lint enable-->

Resolve a package export or import.

Implements the [`PACKAGE_IMPORTS_EXPORTS_RESOLVE`][algorithm-package-imports-exports-resolve] algorithm.

> 👉 **Note**: Returns a promise if
> [`packageTargetResolve`](#packagetargetresolvetpackageurl-target-subpath-patternmatch-isimports-conditions-mainfields-parent-fs),
> returns a promise.

#### Type Parameters

- `T` ([`Awaitable<URL | null | undefined>`](#awaitablet))
  — the resolved package export or import url

#### Parameters

- `matchKey` (`string`)
  — the package subpath extracted from a module specifier, or a dot character (`.`)
- `matchObject` ([`ExportsObject`][pkg-exports-object] | [`Imports`][pkg-imports] | `null` | `undefined`)
  — the package exports or imports
- `packageUrl` ([`ModuleId`](#moduleid))
  — the url of the directory containing the `package.json` file
- `isImports` (`boolean` | `null` | `undefined`)
  — whether `matchObject` is internal to the package
- `conditions` ([`List<Condition>`](#condition) | `null` | `undefined`)
  — the list of export/import conditions
  - **default**: [`defaultConditions`](#defaultconditions)
- `mainFields` ([`List<MainField>`](#mainfield) | `null` | `undefined`)
  — the list of legacy main fields
  - **default**: [`defaultMainFields`](#defaultmainfields)
- `parent` ([`ModuleId`](#moduleid) | `null` | `undefined`)
  — the url of the parent module
- `fs` ([`FileSystem`](#filesystem) | `null` | `undefined`)
  — the file system api

#### Returns

(`T`) The resolved package export or import URL

<!--lint disable-->

### `packageImportsResolve<T>(specifier, parent[, conditions][, mainFields][, fs])`

<!--lint enable-->

Resolve a package import.

Implements the [`PACKAGE_IMPORTS_RESOLVE`][algorithm-package-imports-resolve] algorithm.

> 👉 **Note**: Returns a promise if [`lookupPackageScope`](#lookuppackagescopeturl-end-fs),
> [`packageImportsExportsResolve`](#packageimportsexportsresolvetmatchkey-matchobject-packageurl-isimports-conditions-mainfields-parent-fs),
> or [`readPackageJson`](#readpackagejsontid-specifier-parent-fs) returns a promise.

#### Type Parameters

- `T` ([`Awaitable<URL>`](#awaitablet))
  — the resolved package import url

#### Parameters

- `specifier` (`string`)
  — the import specifier to resolve
- `parent` ([`ModuleId`](#moduleid))
  — the url of the parent module
- `conditions` ([`List<Condition>`](#condition) | `null` | `undefined`)
  — the list of export conditions
  - **default**: [`defaultConditions`](#defaultconditions)
- `mainFields` ([`List<MainField>`](#mainfield) | `null` | `undefined`)
  — the list of legacy main fields
  - **default**: [`defaultMainFields`](#defaultmainfields)
- `fs` ([`FileSystem`](#filesystem) | `null` | `undefined`)
  — the file system api

#### Returns

(`T`) The resolved package import URL

#### Throws

- [`ERR_INVALID_MODULE_SPECIFIER`][err-invalid-module-specifier]
- [`ERR_PACKAGE_IMPORT_NOT_DEFINED`][err-package-import-not-defined]

<!--lint disable-->

### `packageResolve<T>(specifier, parent[, conditions][, mainFields][, fs])`

<!--lint enable-->

Resolve a *bare specifier*.

Implements the [`PACKAGE_RESOLVE`][algorithm-package-resolve] algorithm.

> *Bare specifiers* like `'some-package'` or `'some-package/shuffle'` refer to the main entry point of a package by
> package name, or a specific feature module within a package prefixed by the package name.
> Including the file extension is only necessary for packages without an [`exports`][exports] field.

> 👉 **Note**: Returns a promise if `fs.stat` is async or one of the following methods returns a promise:
> [`legacyMainResolve`](#legacymainresolvetpackageurl-manifest-mainfields-parent-fs),
> [`packageExportsResolve`](#packageexportsresolvetpackageurl-subpath-exports-conditions-parent-fs),
> [`packageSelfResolve`](#packageselfresolvetname-subpath-parent-conditions-fs), or
> [`readPackageJson`](#readpackagejsontid-specifier-parent-fs).

#### Type Parameters

- `T` ([`Awaitable<URL>`](#awaitablet))
  — the resolved package url

#### Parameters

- `specifier` (`string`)
  — the package specifier
- `parent` ([`ModuleId`](#moduleid))
  — the url of the parent module
- `conditions` ([`List<Condition>`](#condition) | `null` | `undefined`)
  — the list of export conditions
  - **default**: [`defaultConditions`](#defaultconditions)
- `mainFields` ([`List<MainField>`](#mainfield) | `null` | `undefined`)
  — the list of legacy main fields
  - **default**: [`defaultMainFields`](#defaultmainfields)
- `fs` ([`FileSystem`](#filesystem) | `null` | `undefined`)
  — the file system api

#### Returns

(`T`) The resolved package URL

#### Throws

- [`ERR_INVALID_MODULE_SPECIFIER`][err-invalid-module-specifier]
- [`ERR_MODULE_NOT_FOUND`][err-module-not-found]

<!--lint disable-->

### `packageSelfResolve<T>(name, subpath, parent[, conditions][, fs])`

<!--lint enable-->

Resolve the self-import of a package.

Implements the [`PACKAGE_SELF_RESOLVE`][algorithm-package-self-resolve] algorithm.

> 👉 **Note**: Returns a promise if [`lookupPackageScope`](#lookuppackagescopeturl-end-fs),
> [`packageExportsResolve`](#packageexportsresolvetpackageurl-subpath-exports-conditions-parent-fs),
> or [`readPackageJson`](#readpackagejsontid-specifier-parent-fs) returns a promise.

#### Type Parameters

- `T` ([`Awaitable<URL | undefined>`](#awaitablet))
  — the resolved package url

#### Parameters

- `name` (`string`)
  — the package name
- `subpath` (`string`)
  — the package subpath
- `parent` ([`ModuleId`](#moduleid))
  — the url of the parent module
- `conditions` ([`List<Condition>`](#condition) | `null` | `undefined`)
  — the list of export conditions
  - **default**: [`defaultConditions`](#defaultconditions)
- `fs` ([`FileSystem`](#filesystem) | `null` | `undefined`)
  — the file system api

#### Returns

(`T`) The resolved package URL

<!--lint disable-->

### `packageTargetResolve<T>(packageUrl, target, subpath[, patternMatch][, isImports][, conditions][, mainFields][, parent][, fs])`

<!--lint enable-->

Resolve a package target.

Implements the [`PACKAGE_TARGET_RESOLVE`][algorithm-package-target-resolve] algorithm.

> 👉 **Note**: Returns a promise if `target` is internal to the package and
> [`packageResolve`](#packageresolvetspecifier-parent-conditions-mainfields-fs) returns a promise.

#### Type Parameters

- `T` ([`Awaitable<URL | null | undefined>`](#awaitablet))
  — the resolved package target url

#### Parameters

- `packageUrl` ([`ModuleId`](#moduleid))
  — the url of the directory containing the `package.json` file
- `target` (`unknown`)
  — the package target (i.e. a `exports`/`imports` value)
- `subpath` (`string`)
  — the package subpath (i.e. a `exports`/`imports` key)
- `patternMatch` (`string` | `null` | `undefined`)
  — the `subpath` pattern match
- `isImports` (`boolean` | `null` | `undefined`)
  — whether `target` is internal to the package
- `conditions` ([`List<Condition>`](#condition) | `null` | `undefined`)
  — the list of export/import conditions
  - **default**: [`defaultConditions`](#defaultconditions)
- `mainFields` ([`List<MainField>`](#mainfield) | `null` | `undefined`)
  — the list of legacy main fields
  - **default**: [`defaultMainFields`](#defaultmainfields)
- `parent` ([`ModuleId`](#moduleid))
  — the url of the parent module
- `fs` ([`FileSystem`](#filesystem) | `null` | `undefined`)
  — the file system api

#### Returns

(`T`) The resolved package target URL

#### Throws

- [`ERR_INVALID_PACKAGE_CONFIG`][err-invalid-package-config]
- [`ERR_INVALID_PACKAGE_TARGET`][err-invalid-package-target]

### `patternKeyCompare(a, b)`

Compare two pattern keys and return a value indicating their order.

Implements the [`PATTERN_KEY_COMPARE`][algorithm-pattern-key-compare] algorithm.

#### Parameters

- `a` (`string`)
  — the first key
- `b` (`string`)
  — the key to compare against `a`

#### Returns

([`PatternKeyComparison`](#patternkeycomparsion)) The pattern key comparsion result

### `patternMatch(matchKey, matchObject)`

Get a subpath pattern match for `matchKey`.

#### Parameters

- `matchKey` (`string`)
  — the key to expand
- `matchObject` (`unknown`)
  — the match keys object

#### Returns

([`PatternMatch`](#patternmatch) | `null`) List, where the first item is the key of a package exports or imports target
object, and the last is a subpath pattern match

### `readPackageJson<T>(id[, specifier][, parent][, fs])`

Read a `package.json` file.

Implements the [`READ_PACKAGE_JSON`][algorithm-read-package-json] algorithm.

> 👉 **Note**: Returns a promise if `fs.readFile` or `fs.stat` is async.

#### Overloads

```ts
function readPackageJson(
  this: void,
  id: EmptyString | null | undefined,
  specifier?: string | null | undefined,
  parent?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): null
```

```ts
function readPackageJson<T extends Awaitable<PackageJson | null>>(
  this: void,
  id: ModuleId | null | undefined,
  specifier?: string | null | undefined,
  parent?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): T
```

#### Type Parameters

- `T` ([`Awaitable<PackageJson | null>`][pkg-package-json])
  — the parsed file contents

#### Parameters

- `id` ([`ModuleId`](#moduleid) | `null` | `undefined`)
  — the url of the package directory, the `package.json` file, or a module in the same directory as a `package.json`
- `specifier` (`string` | `null` | `undefined`)
  — the module specifier that initiated the reading of the `package.json` file
  > 👉 **note**: should be a `file:` url if `parent` is not a url
- `parent` ([`ModuleId`](#moduleid) | `null` | `undefined`)
  — the url of the parent module
- `fs` ([`FileSystem`](#filesystem) | `null` | `undefined`)
  — the file system api

#### Returns

(`T`) The parsed file contents

#### Throws

- [`ERR_INVALID_PACKAGE_CONFIG`][err-invalid-package-config]

### `resolveAlias(specifier[, options])`

Resolve an aliased `specifier`.

#### Parameters

- `specifier` (`string`)
  — the specifier using an alias
- `options` ([`ResolveAliasOptions`](#resolvealiasoptions) | `null` | `undefined`)
  — alias resolution options

#### Returns

(`string` | `null`) The specifier of the aliased module

### `resolveModule<T>(specifier, parent[, options])`

Resolve a module `specifier`.

Implements the [`ESM_RESOLVE`][algorithm-esm-resolve] algorithm, mostly \:wink:.

Adds support for:

- Changing file extensions
- Directory index resolution
- Extensionless file resolution
- Path alias resolution
- Scopeless `@types/*` resolution (i.e. `unist` -> `@types/unist`)

> 👉 **Note**: Returns a promise if
> [`moduleResolve`](#moduleresolvetspecifier-parent-conditions-mainfields-preservesymlinks-fs) returns a promise.

#### Type Parameters

- `T` ([`Awaitable<URL>`](#awaitablet))
  — the resolved url

#### Parameters

- `specifier` (`string`)
  — the module specifier to resolve
- `parent` ([`ModuleId`](#moduleid))
  — the url of the parent module
- `options` ([`ResolveModuleOptions`](#resolvemoduleoptions))
  — module resolution options

#### Returns

(`T`) The resolved URL

### `resolver`

An object containing resolution algorithm implementations.

- [`legacyMainResolve`](#legacymainresolvetpackageurl-manifest-mainfields-parent-fs)
- [`moduleResolve`](#moduleresolvetspecifier-parent-conditions-mainfields-preservesymlinks-fs)
- [`packageExportsResolve`](#packageexportsresolvetpackageurl-subpath-exports-conditions-parent-fs)
- [`packageImportsExportsResolve`](#packageimportsexportsresolvetmatchkey-matchobject-packageurl-isimports-conditions-mainfields-parent-fs)
- [`packageImportsResolve`](#packageimportsresolvetspecifier-parent-conditions-mainfields-fs)
- [`packageResolve`](#packageresolvetspecifier-parent-conditions-mainfields-fs)
- [`packageSelfResolve`](#packageselfresolvetname-subpath-parent-conditions-fs)
- [`packageTargetResolve`](#packagetargetresolvetpackageurl-target-subpath-patternmatch-isimports-conditions-mainfields-parent-fs)

### `root`

`URL`

The URL of the file system root.

### `toRelativeSpecifier(url, parent)`

Turn `url` into a *relative specifier*.

> 👉 **Note**: The relative specifier will only have a file extension if `specifier` also has an extension.

#### Parameters

- `url` ([`ModuleId`](#moduleid))
  — the `file:` url to convert
- `parent` ([`ModuleId`](#moduleid))
  — the parent module id

#### Returns

(`string`) The relative specifier

### `toUrl(id[, parent])`

Convert `id` to a `URL`.

> 👉 **Note**: If `id` cannot be parsed as a `URL` and is also not a [builtin module][builtin-module],
> it will be assumed to be a path and converted to a [`file:` URL][file-url].

#### Parameters

- `id` ([`ModuleId`](#moduleid))
  — the module id to convert
- `parent` ([`ModuleId`](#moduleid) | `null` | `undefined`)
  — the base url to resolve against if `id` is not absolute

#### Returns

(`URL`) The new URL

## Types

This package is fully typed with [TypeScript][].

### `Aliases`

Record, where each key is a path alias or pattern
and each value is a path mapping configuration (`interface`).

```ts
interface Aliases {
  [alias: string]: (string | null | undefined)[] | string | null | undefined
}
```

When developing extensions that use additional aliases, augment `Aliases` to register custom aliases:

```ts
declare module '@flex-development/mlly' {
  interface Aliases {
    custom?: string[] | string | null
  }
}
```

### `Awaitable<T>`

Create a union of `T` and `T` as a promise-like object (`type`).

```ts
type Awaitable<T> = PromiseLike<T> | T
```

#### Type Parameters

- `T` (`any`)
  - the value

### `BufferEncodingMap`

Registry of character encodings that can be used when working with `Buffer` objects (`interface`).

When developing extensions that use additional encodings, augment `BufferEncodingMap` to register custom encodings:

```ts
declare module '@flex-development/mlly' {
  interface BufferEncodingMap {
    custom: 'custom'
  }
}
```

### `BufferEncoding`

Union of values that can occur where a buffer encoding is expected (`type`).

To register new encodings, augment [`BufferEncodingMap`](#bufferencodingmap).
They will be added to this union automatically.

```ts
type BufferEncoding = BufferEncodingMap[keyof BufferEncodingMap]
```

### `ChangeExtFn<[Ext]>`

Get a new file extension for `url` (`type`).

Returning an empty string (`''`), `null`, or `undefined` will remove the current file extension.

```ts
type ChangeExtFn<
  Ext extends string | null | undefined = string | null | undefined
> = (this: void, url: URL, specifier: string) => Ext
```

#### Type Parameters

- `Ext` (`string` | `null` | `undefined`, optional)
  — the new file extension

#### Parameters

- `url` (`URL`)
  — the resolved module URL
- `specifier` (`string`)
  — the module specifier being resolved

#### Returns

(`Ext`) The new file extension

### `ConditionMap`

Registry of export/import conditions (`interface`).

When developing extensions that use additional conditions, augment `ConditionMap` to register custom conditions:

```ts
declare module '@flex-development/mlly' {
  interface ConditionMap {
    custom: 'custom'
  }
}
```

### `Condition`

Union of values that can occur where a export/import condition is expected (`type`).

To register new conditions, augment [`ConditionMap`](#conditionmap).
They will be added to this union automatically.

```ts
type Condition = ConditionMap[keyof ConditionMap]
```

### `Dot`

A dot character (`'.'`) (`type`).

```ts
type Dot = '.'
```

### `EmptyArray`

An empty array (`type`).

```ts
type EmptyArray = []
```

### `EmptyObject`

An empty object (`type`).

```ts
type EmptyObject = { [tag]?: never }
```

### `EmptyString`

An empty string (`type`).

```ts
type EmptyString = ''
```

### `Ext`

A file extension (`type`).

```ts
type Ext = `${Dot}${string}`
```

### `FileContent`

Union of values that can occur where file content is expected (`type`).

```ts
type FileContent = Uint8Array | string
```

### `FileSystem`

The file system API (`interface`).

#### Properties

- `readFile` ([`ReadFile`](#readfilet))
  — read the entire contents of a file
- `realpath` ([`Realpath`](#realpatht))
  — compute a canonical pathname by resolving `.`, `..`, and symbolic links
- `stat` ([`Stat`](#statt))
  — get information about a directory or file

### `GetSourceContext`

Source code retrieval context (`interface`).

#### Extends

- [`GetSourceOptions`](#getsourceoptions)

#### Properties

- `fs` ([`FileSystem`](#filesystem))
  — the file system api
- `handlers` ([`GetSourceHandlers`](#getsourcehandlers))
  — record, where each key is a url protocol and each value is a source code handler
- `req` (`RequestInit`)
  — request options for network based modules
- `schemes` (`Set<string>`)
  — the list of supported url schemes

### `GetSourceHandler`

Get the source code for a module (`type`).

```ts
type GetSourceHandler = (
  this: GetSourceContext,
  url: URL
) => Awaitable<FileContent | null | undefined>
```

#### Parameters

- **`this`** ([`GetSourceContext`](#getsourcecontext))
  — the retrieval context
- `url` (`URL`)
  — the module URL

#### Returns

([`Awaitable<FileContent | null | undefined>`](#filecontent)) The source code

### `GetSourceHandlers`

Record, where key is a URL protocol and each value is a source code handler (`type`).

```ts
type GetSourceHandlers = {
  [H in Protocol]?: GetSourceHandler | null | undefined
}
```

### `GetSourceOptions`

Options for retrieving source code (`interface`).

#### Properties

- `encoding?` ([`BufferEncoding`](#bufferencoding) | `null` | `undefined`)
  — the encoding of the result
  > 👉 **note**: used when the `file:` handler is called
- `format?` ([`ModuleFormat`](#moduleformat) | `null` | `undefined`)
  — the module format hint
- `fs?` ([`FileSystem`](#filesystem) | `null` | `undefined`)
  — the file system api
- `handlers?` ([`GetSourceHandlers`](#getsourcehandlers) | `null` | `undefined`)
  — record, where each key is a url protocol and each value is a source code handler
- `ignoreErrors?` (`boolean` | `null` | `undefined`)
  — whether to ignore [`ERR_UNSUPPORTED_ESM_URL_SCHEME`][err-unsupported-esm-url-scheme] if thrown
- `req?` (`RequestInit` | `null` | `undefined`)
  — request options for network based modules
- `schemes?` ([`List<string>`](#listt) | `null` | `undefined`)
  — the list of supported url schemes
  - **default**: `['data', 'file', 'http', 'https', 'node']`

### `IsDirectory`

Check if a stats object describes a directory (`interface`).

#### Returns

(`boolean`) `true` if stats describes directory, `false` otherwise

### `IsFile`

Check if a stats object describes a file (`interface`).

#### Returns

(`boolean`) `true` if stats describes regular file, `false` otherwise

### `List<[T]>`

A list (`type`).

```ts
type List<T = unknown> = ReadonlySet<T> | readonly T[]
```

#### Type Parameters

- `T` (`any`, optional)
  — list item type

### `MainFieldMap`

Registry of main fields (`interface`).

When developing extensions that use additional fields, augment `MainFieldMap` to register custom fields:

```ts
declare module '@flex-development/mlly' {
  interface MainFieldMap {
    unpkg: 'unpkg'
  }
}
```

### `MainField`

Union of values that can occur where a main field is expected (`type`).

To register new main fields, augment [`MainFieldMap`](#mainfieldmap).
They will be added to this union automatically.

```ts
type MainField = MainFieldMap[keyof MainFieldMap]
```

### `ModuleFormatMap`

Registry of module formats (`interface`).

When developing extensions that use additional formats, augment `ModuleFormatMap` to register custom formats:

```ts
declare module '@flex-development/mlly' {
  interface ModuleFormatMap {
    custom: 'custom'
  }
}
```

### `ModuleFormat`

Union of values that can occur where a module format is expected (`type`).

To register new main formats, augment [`ModuleFormatMap`](#moduleformatmap).
They will be added to this union automatically.

```ts
type ModuleFormat = ModuleFormatMap[keyof ModuleFormatMap]
```

### `ModuleId`

Union of values that can occur where a ECMAScript (ES) module identifier is expected (`type`).

```ts
type ModuleId = URL | string
```

### `Numeric`

A string that can be parsed to a valid number (`type`).

```ts
type Numeric = `${number}`
```

### `PatternKeyComparsionMap`

Registry of [`PATTERN_KEY_COMPARE`][algorithm-pattern-key-compare] algorithm results (`interface`).

When developing extensions that use additional results, augment `PatternKeyComparsionMap` to register custom results:

```ts
declare module '@flex-development/mlly' {
  interface PatternKeyComparsionMap {
    afterThree: 3
  }
}
```

### `PatternKeyComparsion`

Union of values that can occur where a [`PATTERN_KEY_COMPARE`][algorithm-pattern-key-compare] algorithm result
is expected (`type`).

To register new results, augment [`PatternKeyComparisonMap`](#patternkeycomparsionmap).
They will be added to this union automatically.

```ts
type PatternKeyComparison =
  PatternKeyComparisonMap[keyof PatternKeyComparisonMap]
```

### `PatternMatch`

List, where the first item is the key of a package `exports` or `imports` target object,
and the last is a subpath pattern match (`type`).

```ts
type PatternMatch = [expansionKey: string, patternMatch: string | null]
```

### `ProtocolMap`

Registry of URL protocols (`interface`).

When developing extensions that use additional protocols, augment `ProtocolMap` to register custom protocols:

```ts
declare module '@flex-development/mlly' {
  interface ProtocolMap {
    custom: 'custom:'
  }
}
```

### `Protocol`

Union of values that can occur where a URL protocol is expected (`type`).

To register new results, augment [`ProtocolMap`](#protocolmap).
They will be added to this union automatically.

```ts
type Protocol = ProtocolMap[keyof ProtocolMap]
```

### `ReadFile<[T]>`

Read the entire contents of a file (`interface`).

#### Overloads

```ts
(this: void, id: ModuleId, encoding: BufferEncoding): Awaitable<string>
(this: void, id: ModuleId, encoding?: BufferEncoding | null | undefined): T
```

#### Type Parameters

- `T` ([`Awaitable<FileContent | null | undefined>`](#filecontent), optional)
  — the file contents
  - **default**: [`Awaitable<FileContent>`](#filecontent)

#### Parameters

- `id` ([`ModuleId`](#moduleid))
  — the module id
- `encoding` ([`BufferEncoding`](#bufferencoding))
  — the encoding of the file contents

#### Returns

(`T`) The file contents

### `Realpath<[T]>`

Compute a canonical pathname by resolving `.`, `..`, and symbolic links (`interface`).

> 👉 **Note**: A canonical pathname is not necessarily unique.
> Hard links and bind mounts can expose an entity through many pathnames.

#### Type Parameters

- `T` ([`Awaitable<string>`](#awaitablet), optional)
  — the canonical pathname

#### Parameters

- `id` ([`ModuleId`](#moduleid))
  — the module id

#### Returns

(`T`) The canonical pathname

### `ResolveAliasOptions`

Options for path alias resolution (`interface`).

#### Properties

- `absolute?` (`boolean` | `null` | `undefined`)
  — whether the resolved specifier should be absolute.\
  if `true`, the resolved specifier will be a [`file:` URL][file-url]
- `aliases?` ([`Aliases`](#aliases) | `null` | `undefined`)
  — the path mappings dictionary
  > 👉 **note**: paths should be relative to `cwd`
- `cwd?` ([`ModuleId`](#moduleid) | `null` | `undefined`)
  — the url of the directory to resolve non-absolute modules from
  - **default**: [`cwd()`](#cwd)
- `parent?` ([`ModuleId`](#moduleid) | `null` | `undefined`)
  — the url of the parent module

### `ResolveModuleOptions`

Options for path alias resolution (`interface`).

#### Properties

- `aliases?` ([`Aliases`](#aliases) | `null` | `undefined`)
  — the path mappings dictionary
  > 👉 **note**: paths should be relative to `cwd`
- `conditions?` ([`List<Condition>`](#condition) | `null` | `undefined`)
  — the list of export/import conditions
  - **default**: [`defaultConditions`](#defaultconditions)
  > 👉 **note**: should be sorted by priority
- `cwd?` ([`ModuleId`](#moduleid) | `null` | `undefined`)
  — the url of the directory to resolve path `aliases` from
  - **default**: [`cwd()`](#cwd)
- `ext?` ([`ChangeExtFn`](#changeextfnext) | `string` | `null` | `undefined`)
  — a replacement file extension or a function that returns a file extension.
  > 👉 **note**: an empty string (`''`) or `null` will remove a file extension
- `extensions?` ([`List<string>`](#listt) | `null` | `undefined`)
  — the module extensions to probe for
  - **default**: [`defaultExtensions`](#defaultextensions)
  > 👉 **note**: should be sorted by priority
- `fs?` ([`FileSystem`](#filesystem) | `null` | `undefined`)
  — the file system api
- `mainFields?` ([`List<MainField>`](#mainfield) | `null` | `undefined`)
  — the list of legacy `main` fields
  - **default**: [`defaultMainFields`](#defaultmainfields)
  > 👉 **note**: should be sorted by priority
- `preserveSymlinks?` (`boolean` | `null` | `undefined`)
  — whether to keep symlinks instead of resolving them

### `Stat<[T]>`

Get information about a directory or file (`interface`).

#### Type Parameters

- `T` ([`Awaitable<Stats>`](#stats), optional)
  — the info

#### Parameters

- `id` ([`ModuleId`](#moduleid))
  — the module id

#### Returns

(`T`) The info

### `Stats`

An object describing a directory or file (`interface`).

#### Properties

- `isDirectory` ([`IsDirectory`](#isdirectory))
  — check if the stats object describes a directory
- `isFile` ([`IsFile`](#isfile))
  — check if the stats object describes a file

## Contribute

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

This project has a [code of conduct](./CODE_OF_CONDUCT.md). By interacting with this repository, organization, or
community you agree to abide by its terms.

[algorithm-esm-resolve]: ./docs/resolution-algorithm.md#esm_resolvespecifier-parent-conditions-mainfields-preservesymlinks-extensionformatmap

[algorithm-legacy-main-resolve]: ./docs/resolution-algorithm.md#legacy_main_resolvepackageurl-manifest-mainfields

[algorithm-lookup-package-scope]: ./docs/resolution-algorithm.md#lookup_package_scopeurl-end

[algorithm-package-exports-resolve]: ./docs/resolution-algorithm.md#package_exports_resolvepackageurl-subpath-exports-conditions

[algorithm-package-imports-exports-resolve]: ./docs/resolution-algorithm.md#package_imports_exports_resolvematchkey-matchobject-packageurl-isimports-conditions-mainfields

[algorithm-package-imports-resolve]: ./docs/resolution-algorithm.md#package_imports_resolvespecifier-parent-conditions-mainfields

[algorithm-package-resolve]: ./docs/resolution-algorithm.md#package_resolvespecifier-parent-conditions-mainfields

[algorithm-package-self-resolve]: ./docs/resolution-algorithm.md#package_self_resolvename-subpath-parent-conditions

[algorithm-package-target-resolve]: ./docs/resolution-algorithm.md#package_target_resolvepackageurl-target-subpath-patternmatch-isimports-conditions-mainfields

[algorithm-pattern-key-compare]: ./docs/resolution-algorithm.md#pattern_key_comparea-b

[algorithm-read-package-json]: ./docs/resolution-algorithm.md#read_package_jsonid

[builtin-module]: https://nodejs.org/api/esm.html#builtin-modules

[err-invalid-module-specifier]: https://nodejs.org/api/errors.html#err_invalid_module_specifier

[err-invalid-package-config]: https://nodejs.org/api/errors.html#err_invalid_package_config

[err-invalid-package-target]: https://nodejs.org/api/errors.html#err_invalid_package_target

[err-module-not-found]: https://nodejs.org/api/errors.html#err_module_not_found

[err-package-import-not-defined]: https://nodejs.org/api/errors.html#err_package_import_not_defined

[err-unsupported-esm-url-scheme]: https://nodejs.org/api/errors.html#err_unsupported_esm_url_scheme

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[exports]: https://nodejs.org/api/packages.html#exports

[file-url]: https://nodejs.org/api/esm.html#file-urls

[main]: https://github.com/nodejs/node/blob/v22.9.0/doc/api/packages.md#main

[node-esm]: https://nodejs.org/api/esm.html

[pkg-exports]: https://github.com/flex-development/pkg-types/blob/main/src/exports.ts

[pkg-exports-object]: https://github.com/flex-development/pkg-types/blob/main/src/exports-object.ts

[pkg-imports-subpath]: https://github.com/flex-development/pkg-types/blob/main/src/imports-subpath.ts

[pkg-imports]: https://github.com/flex-development/pkg-types/blob/main/src/imports.ts

[pkg-package-json]: https://github.com/flex-development/pkg-types/blob/main/src/package-json.ts

[subpath-imports]: https://nodejs.org/api/packages.html#subpath-imports

[typescript]: https://www.typescriptlang.org

[yarn]: https://yarnpkg.com
