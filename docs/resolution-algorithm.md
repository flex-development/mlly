# Resolution Algorithm

The algorithm to load an ES module specifier is given through the [`ESM_RESOLVE`][esm-resolve] method below.
It returns the resolved `URL` for a module specifier relative to a `parent` URL.

The resolution algorithm determines the full resolved URL for a module load, along with its suggested module format.
It does not determine whether the resolved URL protocol can be loaded, or whether file extensions are permitted, instead
these validations are applied during a load phase (for example, if it was asked to load a URL that has a protocol that
is not `file:`, `data:` or `node:`).

The algorithm also tries to determine the format of the file based on extension ([`ESM_FILE_FORMAT`][esm-file-format]).
If it does not recognize the file extension, then a format of `undefined` is returned, which will result in an error
during the load phase.

The algorithm to determine the module format of a resolved URL is provided by [`ESM_FILE_FORMAT`][esm-file-format],
which returns the unique module format for any file. The `module` format is returned for an ECMAScript Module, while the
`commonjs` format is used to indicate loading through a legacy CommonJS loader.

In the algorithms below, all subroutine errors are propagated as errors of top-level routines unless stated otherwise.

The resolver can throw the following errors:

- [`ERR_INVALID_MODULE_SPECIFIER`][err-invalid-module-specifier]
  — module specifier is an invalid URL, package name or package subpath specifier
- [`ERR_INVALID_PACKAGE_CONFIG`][err-invalid-package-config]
  — a `package.json` configuration is invalid or contains an invalid configuration
- [`ERR_INVALID_PACKAGE_TARGET`][err-invalid-package-target]
  — package exports or imports define a target module for the package that is an invalid type or string target
- [`ERR_MODULE_NOT_FOUND`][err-module-not-found]
  — the package or module requested does not exist
- [`ERR_PACKAGE_IMPORT_NOT_DEFINED`][err-package-import-not-defined]
  — package imports do not define the specifier
- [`ERR_PACKAGE_PATH_NOT_EXPORTED`][err-package-path-not-exported]
  — package exports do not define or permit a target subpath in the package for the given module
- [`ERR_UNSUPPORTED_DIR_IMPORT`][err-unsupported-dir-import]
  — the resolved specifier corresponds to a directory, which is not a supported target for module imports

## Contents

- [`DETECT_MODULE_SYNTAX`][detect-module-syntax]
- [`ESM_FILE_FORMAT`][esm-file-format]
- [`ESM_RESOLVE`][esm-resolve]
- [`LOOKUP_PACKAGE_SCOPE`][lookup-package-scope]
- [`PACKAGE_EXPORTS_RESOLVE`][package-exports-resolve]
- [`PACKAGE_IMPORTS_EXPORTS_RESOLVE`][package-imports-exports-resolve]
- [`PACKAGE_IMPORTS_RESOLVE`][package-imports-resolve]
- [`PACKAGE_RESOLVE`][package-resolve]
- [`PACKAGE_SELF_RESOLVE`][package-self-resolve]
- [`PACKAGE_TARGET_RESOLVE`][package-target-resolve]
- [`PATTERN_KEY_COMPARE`][pattern-key-compare]
- [`READ_PACKAGE_JSON`][read-package-json]

## `DETECT_MODULE_SYNTAX(source)`

1. Parse `source` as an ECMAScript module
2. If the parse is successful, then
   1. If `source` contains top-level `await`, static `import` or `export` statements, or `import.meta`, return `true`
   2. If `source` contains a top-level lexical declaration (`class`, `const`, or `let`) of any CommonJS wrapper
      variables (`__dirname`, `__filename`, `exports`, `module`, or `require`) then return `true`
3. Else return `false`

## `ESM_FILE_FORMAT(url, extensionFormatMap)`

1. ☝️ **Assert**: `url` corresponds to an existing file
2. Let *ext* be the result the file extension of `url`
3. If `extensionFormatMap` has the key *ext*,
   1. Let *format* be the result of `extensionFormatMap.get(ext)`
   2. If `--experimental-wasm-modules` is enabled and *ext* is `'.wasm'`,
      1. Return *format*
   3. Return *format*
4. Let *packageUrl* be the result of [`LOOKUP_PACKAGE_SCOPE(url)`][lookup-package-scope]
5. Let *pjson* be the result of [`READ_PACKAGE_JSON(packageUrl)`][read-package-json]
6. Let *packageType* be `null`
7. If *pjson?.type* is `'module'` or `'commonjs'`, then
   1. Set *packageType* to *pjson.type*
8. If `url` ends in `'.js'`, then
   1. If *packageType* is not `null`, then
      1. Return *packageType*.
   2. If the result of [`DETECT_MODULE_SYNTAX(source)`](#detect_module_syntaxsource) is `true`, then
      1. Return `'module'`
   3. Return `'commonjs'`
9. If `url` does not have any extension, then
   1. If *packageType* is `'module'` and `--experimental-wasm-modules` is enabled and the file at `url` contains the
      header for a WebAssembly module, then
      1. Return `'wasm'`
   2. If *packageType* is not `null`, then
      1. Return *packageType*
   3. If the result of [`DETECT_MODULE_SYNTAX(source)`](#detect_module_syntaxsource) is `true`, then
      1. Return `'module'`
   4. Return `'commonjs'`
10. Return `undefined` (will throw during load phase)

<!--lint disable-->

## `ESM_RESOLVE(specifier, parent, conditions, mainFields, preserveSymlinks, extensionFormatMap)`

<!--lint enable-->

1. Let *resolved* be `undefined`
2. If `specifier` is a valid URL, then
   1. Set *resolved* to the result of parsing and re-serializing `specifier` as a URL
3. Otherwise, if `specifier` starts with `'/'`, `'./'`, or `'../'`, then
   1. Set *resolved* to the URL resolution of `specifier` relative to `parent`
4. Otherwise, if `specifier` starts with `'#'`, then
   1. Set *resolved* to the result of
      [`PACKAGE_IMPORTS_RESOLVE(specifier, parent, conditions, mainFields`][package-imports-resolve]
5. Otherwise,
   1. 👉 **Note**: `specifier` is now a bare specifier
   2. Set *resolved* the result of [`PACKAGE_RESOLVE(specifier, parent, conditions, mainFields)`][package-resolve]
6. Let *format* be `undefined`
7. If *resolved* is a `file:` URL, then
   1. If *resolved* contains any percent encodings of `'/'` or `'\\'` (`'%2F'` and `'%5C'` respectively), then
      1. Throw [`ERR_INVALID_MODULE_SPECIFIER`][err-invalid-module-specifier]
   2. If the file at *resolved* is a directory, then
      1. Throw [`ERR_UNSUPPORTED_DIR_IMPORT`][err-unsupported-dir-import]
   3. If the file at *resolved* does not exist, then
      1. Throw [`ERR_MODULE_NOT_FOUND`][err-module-not-found]
   4. Set *resolved* to the real path of *resolved*, maintaining the same URL querystring and fragment components
   5. Set *format* to the result of [`ESM_FILE_FORMAT(resolved, extensionFormatMap)`][esm-file-format]
8. Otherwise,
   1. Set *format* the module format of the content type associated with the URL *resolved*
9. Return *format* and *resolved* to the loading phase

<!--lint disable-->

## `LEGACY_MAIN_RESOLVE(packageUrl, manifest, mainFields)`

<!--lint enable-->

1. For each *mainField* in *mainFields*, do
   1. Let *tries* be the list of possible entry point URL inputs
   2. Let *mainFieldValue* be the result of `manifest[mainField]`
   3. If *mainFieldValue* is a string, then
      1. Push *mainFieldValue*, `./${value}.js`, `./${value}.json`, `./${value}.node`, `./${value}/index.js`,
         `./${value}/index.json`, and `./${value}/index.node` into *tries*
   4. Push `'./index.js'`, `'./index.json'`, and `'./index.node'` into *tries*
   5. For each item *input* in *tries*, do
      1. Let *mainUrl* be the URL resolution of *input* relative to *packageUrl*
      2. If the file at *mainUrl* exists,
         1. Return *mainUrl*
2. Throw [`ERR_MODULE_NOT_FOUND`][err-module-not-found]

## `LOOKUP_PACKAGE_SCOPE(url, end)`

1. Let *scopeUrl* be `url`
2. While *scopeUrl* is not `end`,
   1. Set *scopeUrl* to the parent URL of *scopeUrl*
   2. If *scopeUrl* ends in a `'node_modules'` path segment, return `null`
   3. Let *pjsonUrl* be the resolution of `'package.json'` within *scopeUrl*
   4. If the file at *pjsonUrl* exists, then
      1. Return *scopeUrl*
3. Return `null`

<!--lint disable-->

## `PACKAGE_EXPORTS_RESOLVE(packageUrl, subpath, exports, conditions)`

<!--lint enable-->

1. If `exports` is an `Object` with both a key starting with `'.'` and a key not starting with `'.'`,
   1. Throw [`ERR_INVALID_PACKAGE_CONFIG`][err-invalid-package-config]
2. If `subpath` is equal to `'.'`, then
   1. Let *mainExport* be `undefined`
   2. If *exports* is a `Array`, `String` or an `Object` containing no keys starting with `'.'`, then
      1. Set *mainExport* to `exports`
   3. Otherwise if `exports` is an `Object` containing a `'.'` property, then
      1. Set *mainExport* to `exports['.']`
   4. If *mainExport* is not `undefined`, then
      1. Let *resolved* be the result of
         [`PACKAGE_TARGET_RESOLVE(packageUrl, mainExport, null, false, conditions)`][package-target-resolve]
      2. If *resolved* is not `null` or `undefined`,
         1. Return *resolved*
3. Otherwise, if `exports` is an `Object` and all keys of `exports` start with `'.'`, then
   1. ☝️ **Assert**: `subpath` begins with `'./'`
   2. Let *resolved* be the result of
      [`PACKAGE_IMPORTS_EXPORTS_RESOLVE(subpath, exports, packageUrl, false)`][package-imports-exports-resolve]
   3. If *resolved* is not `null` or `undefined`,
      1. Return *resolved*
4. Throw [`ERR_PACKAGE_PATH_NOT_EXPORTED`][err-package-path-not-exported]

<!--lint disable-->

## `PACKAGE_IMPORTS_EXPORTS_RESOLVE(matchKey, matchObject, packageUrl, isImports, conditions, mainFields)`

<!--lint enable-->

1. If `matchKey` is a key of `matchObj` and does not contain `'*'`, then
   1. Let *target* be the value of `matchObj[matchKey]`
   2. Return the result of
      [`PACKAGE_TARGET_RESOLVE(packageUrl, target, null, isImports, conditions, mainFields)`][package-target-resolve]
2. Let *expansionKeys* be the list of keys of *matchObj* containing only a single `'*'`, sorted by the sorting function
   [`PATTERN_KEY_COMPARE`][pattern-key-compare] which orders in descending order of specificity
3. For each key *expansionKey* in *expansionKeys*, do
   1. Let *patternBase* be the substring of *expansionKey* up to but excluding the first `'*'` character
   2. If *matchKey* starts with, but is not equal, to *patternBase*, then
      1. Let *patternTrailer* be the substring of *expansionKey* from the index after the first `'*'` character
      2. If *patternTrailer* has zero length, or if *matchKey* ends with *patternTrailer* and the length of *matchKey*
         is greater than or equal to the length of *expansionKey*, then
         1. Let *target* the value of `matchObj[expansionKey]`
         2. Let *patternMatch* be the substring of *matchKey* starting at the index of the length of *patternBase* up to
            the length of *matchKey* minus the length of *patternTrailer*
         3. Return the result of [`PACKAGE_TARGET_RESOLVE(packageUrl, target, patternMatch, isImports, conditions, mainFields)`][package-target-resolve]
4. Return `null`

<!--lint disable-->

## `PACKAGE_IMPORTS_RESOLVE(specifier, parent, conditions, mainFields)`

<!--lint enable-->

1. ☝️ **Assert**: `specifier` begins with `'#'`
2. If `specifier` is exactly equal to `'#'` or starts with `'#/'`\*, then
   1. Throw [`ERR_INVALID_MODULE_SPECIFIER`][err-invalid-module-specifier]
3. Let *packageUrl* be the result of [`LOOKUP_PACKAGE_SCOPE(parent)`][lookup-package-scope]
4. If *packageUrl* is not `null`, then
   1. Let *pjson* be the result of [`READ_PACKAGE_JSON(packageUrl)`][read-package-json]
   2. If *pjson.imports* is a non-null `Object`, then
      1. Let *resolved* be the result of [`PACKAGE_IMPORTS_EXPORTS_RESOLVE(specifier, pjson.imports, packageUrl, true, conditions, mainFields)`][package-imports-exports-resolve]
      2. If *resolved* is not `null` or `undefined`,
         1. Return *resolved*
5. Throw [`ERR_PACKAGE_IMPORT_NOT_DEFINED`][err-package-import-not-defined]

## `PACKAGE_RESOLVE(specifier, parent, conditions, mainFields)`

1. Let *packageName* be `undefined`
2. If `specifier` is an empty string, then
   1. Throw [`ERR_INVALID_MODULE_SPECIFIER`][err-invalid-module-specifier]
3. If `specifier` is a Node.js builtin module name, then
   1. Return `specifier` as a `node:` URL
4. If `specifier` does not start with `'@'`, then
   1. Set *packageName* to the substring of `specifier` until the first `'/'` separator or the end of the string
5. Otherwise,
   1. If `specifier` does not contain a `'/'` separator, then
      1. Throw [`ERR_INVALID_MODULE_SPECIFIER`][err-invalid-module-specifier]
   2. Set *packageName* to the substring of `specifier` until the second `'/'` separator or the end of the string
6. If *packageName* starts with `'.'` or contains `'\\'` or `'%'`, then
   1. Throw [`ERR_INVALID_MODULE_SPECIFIER`][err-invalid-module-specifier]
7. Let *packageSubpath* be `'.'` concatenated with the substring of `specifier` from the position at the length of
   *packageName*
8. If *packageSubpath* ends in `'/'`, then
   1. Throw [`ERR_INVALID_MODULE_SPECIFIER`][err-invalid-module-specifier]
9. Let *selfUrl* be the result of
   [`PACKAGE_SELF_RESOLVE(packageName, packageSubpath, parent, conditions)`][package-self-resolve]
10. If *selfUrl* is not `undefined`,
    1. Return *selfUrl*
11. While *parentUrl* is not the file system root,
    1. Let *packageUrl* be the URL resolution of `'node_modules/'` concatenated with `specifier`,
       relative to *parentUrl*
    2. Set *parentUrl* to the parent folder URL of *parentUrl*.
    3. If the folder at *packageUrl* does not exist, then
       1. Continue the next loop iteration
    4. Let *pjson* be the result of [`READ_PACKAGE_JSON(packageUrl)`][read-package-json]
    5. If *pjson* is not `null` and *pjson.exports* is not `null` or `undefined`, then
       1. Return the result of
          [`PACKAGE_EXPORTS_RESOLVE(packageUrl, packageSubpath, pjson.exports, conditions)`][package-exports-resolve]
    6. Otherwise, if *packageSubpath* is equal to `'.'`, then
       1. Return the result of [`LEGACY_MAIN_RESOLVE(packageUrl, pjson, mainFields)`][legacy-main-resolve]
    7. Otherwise,
       1. Return the URL resolution of *packageSubpath* in *packageUrl*
12. Throw [`ERR_MODULE_NOT_FOUND`][err-module-not-found]

## `PACKAGE_SELF_RESOLVE(name, subpath, parent, conditions)`

1. Let *packageUrl* be the result of [`LOOKUP_PACKAGE_SCOPE(parent)`][lookup-package-scope]
2. If *packageUrl* is `null`, then
   1. Return `undefined`
3. Let *pjson* be the result of [`READ_PACKAGE_JSON(packageUrl)`][read-package-json]
4. If *pjson* is `null` or if *pjson.exports* is `null` or `undefined`, then
   1. Return `undefined`
5. If *pjson.name* is equal to `name`, then
   1. Return the result of
      [`PACKAGE_EXPORTS_RESOLVE(packageUrl, subpath, pjson.exports, conditions)`][package-exports-resolve]
6. Otherwise, return `undefined`

<!--lint disable-->

## `PACKAGE_TARGET_RESOLVE(packageUrl, target, subpath, patternMatch, isImports, conditions, mainFields)`

<!--lint enable-->

1. If `target` is a `String`, then
   1. If `target` does not start with `'./'`, then
      1. If `isImports` is `false`, or if `target` starts with `'../'` or `'/'`, or if `target` is a valid URL, then
         1. Throw [`ERR_INVALID_PACKAGE_TARGET`][err-invalid-package-target]
      2. If `patternMatch` is a `String`, then
         1. Let *matchedTarget* be `target` with every instance of `'*'` replaced by `patternMatch`
         2. Return [`PACKAGE_RESOLVE(matchedTarget, packageUrl + '/', conditions, mainFields)`][package-resolve]
      3. Return [`PACKAGE_RESOLVE(target, packageUrl + '/', conditions, mainFields)`][package-resolve]
   2. If `target` split on `'/'` or `'\\'` contains any `''`, `'.'`, `'..'`, or `'node_modules'` segments after the
      first `'.'` segment, case insensitive and including percent encoded variants,
      1. Throw [`ERR_INVALID_PACKAGE_TARGET`][err-invalid-package-target]
   3. Let *resolvedTarget* be the URL resolution of the concatenation of `packageUrl` and `target`
   4. ☝️ **Assert**: `packageUrl` is contained in *resolvedTarget*
   5. If *patternMatch* is `null`, then
      1. Return *resolvedTarget*
   6. If *patternMatch* split on `'/'` or `'\\'` contains any `''`, `'.'`, `'..'`, or `'node_modules'` segments, case
      insensitive and including percent encoded variants,
      1. Throw [`ERR_INVALID_MODULE_SPECIFIER`][err-invalid-module-specifier]
   7. Return the URL resolution of *resolvedTarget* with every instance of `'*'` replaced with *patternMatch*
2. Otherwise, if `target` is a non-null `Object`, then
   1. If `target` contains any index property keys, as defined in [ECMA-262 6.1.7 Array Index][ecma-integer-index],
      1. Throw [`ERR_INVALID_PACKAGE_CONFIG`][err-invalid-package-config]
   2. For each property *p* of `target`, in object insertion order as,
      1. If *p* equals `'default'` or `conditions` contains an entry for *p*, then
         1. Let *targetValue* be the value of the *p* property in `target`
         2. Let *resolved* be the result of `PACKAGE_TARGET_RESOLVE(packageUrl, targetValue, patternMatch, isImports, mainFields)`
         3. If *resolved* is not `undefined`, then
            1. Return *resolved*
         4. Otherwise, continue the loop
   3. Return `undefined`
3. Otherwise, if `target` is an `Array`, then
   1. If `target.length` is zero (`0`), return `null`
   2. For each item *targetValue* in `target`, do
      1. Let *resolved* be the result of `PACKAGE_TARGET_RESOLVE(packageUrl, targetValue, patternMatch, isImports, mainFields)`,
         continuing the loop on any [`ERR_INVALID_PACKAGE_TARGET`][err-invalid-package-target]
      2. If *resolved* is not `undefined`, then
         1. Return *resolved*
      3. Otherwise, continue the loop
   3. Throw the last fallback resolution error or return `null`.
4. Otherwise, if `target` is `null`, then
   1. Return `target`
5. Otherwise,
   1. Throw [`ERR_INVALID_PACKAGE_TARGET`][err-invalid-package-target]

## `PATTERN_KEY_COMPARE(a, b)`

1. ☝️ **Assert**: `a` contains only a single `'*'`
2. ☝️ **Assert**: `b` contains only a single `'*'`
3. Let *baseLengthA* be the index of `'*'` in `a`
4. Let *baseLengthB* be the index of `'*'` in `b`
5. If *baseLengthA* is greater than *baseLengthB*
   1. Return `-1`
6. If *baseLengthB* is greater than *baseLengthA*
   1. Return `1`
7. If the length of `a` is greater than the length of `b`
   1. Return `-1`
8. If the length of `b` is greater than the length of `a`
   1. Return `1`
9. Return `0`

## `READ_PACKAGE_JSON(id)`

1. Let *pjsonUrl* be the resolution of `'package.json'` within `id`
2. If the file at *pjsonUrl* does not exist, then
   1. Return `null`
3. If the file at *pjsonUrl* does not parse as valid JSON, then
   1. Throw [`ERR_INVALID_PACKAGE_CONFIG`][err-invalid-package-config]
4. If the file at *pjsonUrl* does not parse to a JSON object, then
   1. Throw [`ERR_INVALID_PACKAGE_CONFIG`][err-invalid-package-config]
5. Return the parsed JSON source of the file at *pjsonUrl*

[detect-module-syntax]: #detect_module_syntaxsource

[ecma-integer-index]: https://tc39.es/ecma262/#integer-index

[err-invalid-module-specifier]: https://nodejs.org/api/errors.html#err_invalid_module_specifier

[err-invalid-package-config]: https://nodejs.org/api/errors.html#err_invalid_package_config

[err-invalid-package-target]: https://nodejs.org/api/errors.html#err_invalid_package_target

[err-module-not-found]: https://nodejs.org/api/errors.html#err_module_not_found

[err-package-import-not-defined]: https://nodejs.org/api/errors.html#err_package_import_not_defined

[err-package-path-not-exported]: https://nodejs.org/api/errors.html#err_package_path_not_exported

[err-unsupported-dir-import]: https://nodejs.org/api/errors.html#err_unsupported_dir_import

[esm-file-format]: #esm_file_formaturl-extensionformatmap

[esm-resolve]: #esm_resolvespecifier-parent-conditions-mainfields-preservesymlinks-extensionformatmap

[legacy-main-resolve]: #legacy_main_resolvepackageurl-manifest-mainfields

[lookup-package-scope]: #lookup_package_scopeurl-end

[package-exports-resolve]: #package_exports_resolvepackageurl-subpath-exports-conditions

[package-imports-exports-resolve]: #package_imports_exports_resolvematchkey-matchobject-packageurl-isimports-conditions-mainfields

[package-imports-resolve]: #package_imports_resolvespecifier-parent-conditions-mainfields

[package-resolve]: #package_resolvespecifier-parent-conditions-mainfields

[package-self-resolve]: #package_self_resolvename-subpath-parent-conditions

[package-target-resolve]: #package_target_resolvepackageurl-target-subpath-patternmatch-isimports-conditions-mainfields

[pattern-key-compare]: #pattern_key_comparea-b

[read-package-json]: #read_package_jsonid
