## [1.0.0-alpha.6](https://github.com/flex-development/mlly/compare/1.0.0-alpha.5...1.0.0-alpha.6) (2022-12-26)


### :package: Build

* **deps-dev:** bump vue-tsc from 1.0.17 to 1.0.18 ([68255dc](https://github.com/flex-development/mlly/commit/68255dc3ad4be30eae7ea61598d4494d1913717b))
* **deps:** bump import-meta-resolve from 2.1.0 to 2.2.0 ([8ce9cfc](https://github.com/flex-development/mlly/commit/8ce9cfc6a49b3b69c4b129b42b171d60ce3d2b91))
* **deps:** bump tsconfig-paths from 4.1.0 to 4.1.1 ([6cb2847](https://github.com/flex-development/mlly/commit/6cb2847c229d0d0ba0715a725da4689752a5a899))


### :bug: Fixes

* **specifiers:** `toRelativeSpecifier` logic ([#27](https://github.com/flex-development/mlly/issues/27)) ([a34d974](https://github.com/flex-development/mlly/commit/a34d97448135da0e0f46654b720ba60fc84abcea))


### :house_with_garden: Housekeeping

* **github:** add "package manager" dropdown to bug report template ([2942a31](https://github.com/flex-development/mlly/commit/2942a312411de0a2b4113e163214ca8ef064c87b))
* **github:** add label `scope:analyze` ([241ac69](https://github.com/flex-development/mlly/commit/241ac6992361ee57631779f48cc87525d4e3f220))
* **github:** add label `scope:lib` ([25b2d67](https://github.com/flex-development/mlly/commit/25b2d679f9d400afdef52bd159afd477daf60077))
* **github:** add label `scope:resolve` ([36159e6](https://github.com/flex-development/mlly/commit/36159e688680db513417a9d9f7ce0cf72a45695c))
* **github:** add label `scope:specifiers` ([5ca8266](https://github.com/flex-development/mlly/commit/5ca8266c8c3a7f5448eadad734530837bdeae434))
* **github:** add label `scope:syntax` ([54b2585](https://github.com/flex-development/mlly/commit/54b25854b8da7875087d42f79164ec73794c054f))
* **github:** add label `status:triaged` ([35523e0](https://github.com/flex-development/mlly/commit/35523e06028b34b8c82f9b5ba2553fd0bd28b7e7))

## [1.0.0-alpha.5](https://github.com/flex-development/mlly/compare/1.0.0-alpha.4...1.0.0-alpha.5) (2022-12-26)


### :robot: Continuous Integration

* **workflows:** [`publish`] remove stale `.npmrc` file from checkout ([da570a6](https://github.com/flex-development/mlly/commit/da570a6ce355c267ab09fd94c41c99eaef892f2e))
* **workflows:** use environment files ([03f8097](https://github.com/flex-development/mlly/commit/03f8097c0213f46fc110c61265345d21b09dee76))

## [1.0.0-alpha.4](https://github.com/flex-development/mlly/compare/1.0.0-alpha.3...1.0.0-alpha.4) (2022-12-26)


### :robot: Continuous Integration

* **workflows:** [`publish`] fix registry url ([c06d3ca](https://github.com/flex-development/mlly/commit/c06d3ca72de415e507d901864afc410c9f5239b3))


### :pencil: Documentation

* fix changelog entries ([128f8f4](https://github.com/flex-development/mlly/commit/128f8f450eda1fc10ff89ac272fbe8bde870c516))

## [1.0.0-alpha.3](https://github.com/flex-development/mlly/compare/1.0.0-alpha.2...1.0.0-alpha.3) (2022-12-26)


### ⚠ BREAKING CHANGES

* **types:** remove `Ext`
* **types:** `SpecifierType` -> `ModuleSpecifierType`
* statements

### :package: Build

* **deps-dev:** add @flex-development/docast ([42b8ed2](https://github.com/flex-development/mlly/commit/42b8ed2360e8b4478202ba7db7e2b5cacae9ec90))
* **deps-dev:** bump @flex-development/docast-parse to 1.0.0-alpha.4 ([9634f8d](https://github.com/flex-development/mlly/commit/9634f8d4ec4375e7d29ad709c36ce1d398293718))
* **deps-dev:** bump @flex-development/mkbuild from 1.0.0-alpha.8 to 1.0.0-alpha.9 ([0262207](https://github.com/flex-development/mlly/commit/026220768f780149e143c0a5e6d35f9c2a4f0215))
* **deps-dev:** bump deps according to `yarn upgrade-interactive` ([ab0b8ce](https://github.com/flex-development/mlly/commit/ab0b8ced1e664a9bb6a9f4a7189d870bdf76c8c0))
* **deps-dev:** bump deps according to `yarn upgrade-interactive` ([bddfa7c](https://github.com/flex-development/mlly/commit/bddfa7c3f8864ab38fe35dc295ab46e472df187e))
* **deps:** add @flex-development/tsconfig-types ([a7c38e5](https://github.com/flex-development/mlly/commit/a7c38e50ea583dde948078569b41e0aebde8cfbf))
* **deps:** replace upath with @flex-development/pathe ([8a584d6](https://github.com/flex-development/mlly/commit/8a584d6dc2fed8c4cae491c290cf58ded9ca038e))
* **docs:** [site] use flex-development/docast-parse@27c73c7c03df4d92585c538c1f8214886b1fd0a9 ([b696cf6](https://github.com/flex-development/mlly/commit/b696cf676ecb0ace14647727415a49d03092d0d5))


### :robot: Continuous Integration

* configure private package registry for [@dependabot](https://github.com/dependabot) ([e188761](https://github.com/flex-development/mlly/commit/e1887618c8a2c5fe9cb69babd15498b618e64e66))
* fix [@dependabot](https://github.com/dependabot) npm package-ecosystem x yarn integration ([126dfab](https://github.com/flex-development/mlly/commit/126dfab8d937f3526ea109acc91565accf3b2653))
* **deps:** bump actions/add-to-project from 0.3.0 to 0.4.0 ([b5e8279](https://github.com/flex-development/mlly/commit/b5e8279269f75cee5076d86b7c34578b74f306df))
* **deps:** bump actions/checkout from 3.1.0 to 3.2.0 ([0637831](https://github.com/flex-development/mlly/commit/063783140fb475f29f821408837389219c471625))
* **deps:** bump dessant/lock-threads from 3.0.0 to 4.0.0 ([ba6063c](https://github.com/flex-development/mlly/commit/ba6063cb88556d106fb01c3948ba03d8f4848a47))
* **deps:** bump flex-development/dist-tag-action from 1.1.1 to 1.1.2 ([e19b975](https://github.com/flex-development/mlly/commit/e19b97514d655b2c89e7fa4b09aa3ea93a0f8415))
* **workflows:** [`add-to-project`] add items from repo admin account ([e271e8a](https://github.com/flex-development/mlly/commit/e271e8afe22244e3d270aa02a833ccb4b077f296))
* **workflows:** [`ci`] add node.js matrix ([28a0fa6](https://github.com/flex-development/mlly/commit/28a0fa6d809c94af458c6d5c9b661bb9d564b70a))
* **workflows:** [`ci`] archive production artifacts ([701caea](https://github.com/flex-development/mlly/commit/701caea0edc1e2d36d7a1323a88e1e714e88743d))
* **workflows:** [`ci`] let [@dependabot](https://github.com/dependabot) modify lockfile ([74ec538](https://github.com/flex-development/mlly/commit/74ec5381fd5339d0d29b1a5529e48d8b86fc2419))
* **workflows:** [`ci`] re-add node14 to matrix ([44801d8](https://github.com/flex-development/mlly/commit/44801d803774588c46299050ff858027605a2079))
* **workflows:** [`ci`] update codecov environment ([32518bd](https://github.com/flex-development/mlly/commit/32518bdd2650e01bc92dd6e212ef9420f239ac9f))
* **workflows:** [`ci`] update node setup ([b326f5d](https://github.com/flex-development/mlly/commit/b326f5d35c968fd4f1145a50a769e8d645190941))
* **workflows:** [`ci`] upload coverage reports to codecov ([a24776b](https://github.com/flex-development/mlly/commit/a24776ba0c3aad87e36881f5558eba58f5f7a866))
* **workflows:** [`publish`] cleanup registry scope ([ba5b355](https://github.com/flex-development/mlly/commit/ba5b355f30e62cb863abd35eddaa28b5b0885f56))
* **workflows:** [`publish`] print contents of `.npmrc` file ([2c16ff6](https://github.com/flex-development/mlly/commit/2c16ff62786d8ecc1f403d364af4d6db372e5a75))
* **workflows:** [`publish`] use node version file ([80d68c1](https://github.com/flex-development/mlly/commit/80d68c13aac5cdb0005c236d56bb8db90bd831a0))
* **workflows:** [`release`] publish releases from repo admin account ([bbda19c](https://github.com/flex-development/mlly/commit/bbda19ca37155411a0a4e9bf4e734a7b7ad959c8))


### :pencil: Documentation

* add "contributor covenant code of conduct" ([8f1285b](https://github.com/flex-development/mlly/commit/8f1285b12b7c74401c962d614e2c79a6a0c89585))


### :bug: Fixes

* **install:** [git] make `postinstall` script work with git install ([1a70af2](https://github.com/flex-development/mlly/commit/1a70af2bed20cbb6667ca0dd3e8d2e7d6a38da4b))


### :house_with_garden: Housekeeping

* project qa ([4acf639](https://github.com/flex-development/mlly/commit/4acf639b6b28c20a782e39d6f4a8c4b2adb0ae20))
* project qa ([3120990](https://github.com/flex-development/mlly/commit/312099035d0a90f044688e6619ec84dd6049d8bb))
* **github:** add commit scope `install` ([065dbbb](https://github.com/flex-development/mlly/commit/065dbbbfd271e576d5031fcd155e91007cb95f62))
* **github:** add label `scope:install` ([3ddc9c2](https://github.com/flex-development/mlly/commit/3ddc9c29e92e0e254f48f87ce7052196b79c9cc1))
* **internal:** remove barrel file ([e0ba89c](https://github.com/flex-development/mlly/commit/e0ba89cceee97e99111dd4ab7c63601b593a24d5))
* **pkg:** add keywords `ecmascript-modules` and `esmodules` ([e994f4b](https://github.com/flex-development/mlly/commit/e994f4bb182f0861f3c1c3c68c1a9d0a9a3d6631))
* **tests:** local codecov integration ([bdbae1d](https://github.com/flex-development/mlly/commit/bdbae1d44cc60409a3dabb23acae79f8180b187a))
* **yarn:** bump yarn from 4.0.0-rc.14 to 4.0.0-rc.34 ([045ee62](https://github.com/flex-development/mlly/commit/045ee6252342027657771d7bbdab6748fbb9a36a))


### :zap: Refactors

* statements ([731bd2a](https://github.com/flex-development/mlly/commit/731bd2a770671ad771ff38e8b12fce513034db27))
* **ts:** enforce `exactOptionalPropertyTypes` ([f3109b4](https://github.com/flex-development/mlly/commit/f3109b4cb6b33528ac2655e9c90eb86a2512b00d))
* **types:** `SpecifierType` -> `ModuleSpecifierType` ([263e98b](https://github.com/flex-development/mlly/commit/263e98b4e8189315157dfb4940df76e61a661922))
* **types:** remove `Ext` ([303de20](https://github.com/flex-development/mlly/commit/303de200e3eddf4c6c33fd41db6f6f0ad84fe8ec))


### :white_check_mark: Testing

* **ts:** add remaining type tests ([7a5430f](https://github.com/flex-development/mlly/commit/7a5430f4d95392b9fa6637d09765dcdd79d275b4))

## [1.0.0-alpha.2](https://github.com/flex-development/mlly/compare/1.0.0-alpha.1...1.0.0-alpha.2) (2022-11-06)


### :robot: Continuous Integration

* **workflows:** fix production docs deployment ([511fb53](https://github.com/flex-development/mlly/commit/511fb53ae423fe6d77b0447427affb0a1c0e2802))

## 1.0.0-alpha.1 (2022-11-06)


### :package: Build

* cleanup build target settings ([b809be9](https://github.com/flex-development/mlly/commit/b809be9934c6661c98bdcfd3a568e7d34c0fe445))
* remove `src` files from distribution ([0603ebe](https://github.com/flex-development/mlly/commit/0603ebefae0002c13f7d255ff2cc20cdf4057c7e))
* require node `>=14.16` ([cd0dda9](https://github.com/flex-development/mlly/commit/cd0dda9dfae0bd205875f34d8fd8f2022e36d303))
* **deps-dev:** bump @flex-development/mkbuild from 1.0.0-alpha.6 to 1.0.0-alpha.8 ([567bea8](https://github.com/flex-development/mlly/commit/567bea892e46be9cc04885e97a0d76235e68bd0c))
* **deps-dev:** bump deps according to `yarn upgrade-interactive` ([e3649d4](https://github.com/flex-development/mlly/commit/e3649d4d98a59562a0ee27800eb33d1f6cc73c03))
* **deps-dev:** bump deps according to `yarn upgrade-interactive` ([cdfc9af](https://github.com/flex-development/mlly/commit/cdfc9af3bbce508aceb0fa80d41b9de567383a14))
* **deps-dev:** bump deps according to `yarn upgrade-interactive` ([24ee68b](https://github.com/flex-development/mlly/commit/24ee68b94523fca0ea9498068efc1765eb8f0a97))
* **deps:** replace `pathe` with `upath` ([f705671](https://github.com/flex-development/mlly/commit/f705671f193a7c3a0d24e49e7769683b5876aeae))
* **docs:** [site] use flex-development/docast@48367224ce9b9aa804d872071fc7e6fc6a2f38b3 ([06324f7](https://github.com/flex-development/mlly/commit/06324f723d88320e0de86563b2b78e7d3d02618c))
* **docs:** [site] use flex-development/docast@dd4b6c3b2d4e770df99f3a2b90032f228dcd76a8 ([3de807d](https://github.com/flex-development/mlly/commit/3de807d36c5b06760c9cd8d72b98ca4b0a7233ff))
* **pkg:** remove extraneous `bin` field ([b56c209](https://github.com/flex-development/mlly/commit/b56c2098cf328b89f8e6c34862ebc63668f9e348))
* **syntax:** export `detectSyntax` ([4f3850f](https://github.com/flex-development/mlly/commit/4f3850f60fe9c4981337452d377f29cb6bcceb6d))
* **syntax:** export `hasESMSyntax` ([64a89b2](https://github.com/flex-development/mlly/commit/64a89b235e8ae23c0e63fa013c110a3ca173785a))
* **ts:** reorganize `typesVersions` ([53430fe](https://github.com/flex-development/mlly/commit/53430fe8d4e99a0792e4b64a136d8ba779d51e21))


### :robot: Continuous Integration

* add [@dependabot](https://github.com/dependabot) config ([ca31ac5](https://github.com/flex-development/mlly/commit/ca31ac58e4fcedb5feb2a86a134503ef2819fe00))
* **deps:** bump actions/checkout from 3.0.2 to 3.1.0 ([#1](https://github.com/flex-development/mlly/issues/1)) ([a7fdf9e](https://github.com/flex-development/mlly/commit/a7fdf9e9a3d84f37e7f436a544e98692f8988cac))
* **deps:** bump actions/github-script from 6.3.1 to 6.3.2 ([#3](https://github.com/flex-development/mlly/issues/3)) ([ef9e10d](https://github.com/flex-development/mlly/commit/ef9e10d9a08699961fee8acd664fadf8f1b95729))
* **deps:** bump actions/github-script from 6.3.2 to 6.3.3 ([#5](https://github.com/flex-development/mlly/issues/5)) ([68306db](https://github.com/flex-development/mlly/commit/68306db8078fdcaa0a0a6ef80195335c5d7b825d))
* **deps:** bump actions/setup-node from 3.5.0 to 3.5.1 ([#6](https://github.com/flex-development/mlly/issues/6)) ([c303f3e](https://github.com/flex-development/mlly/commit/c303f3e592508eb73e1e7f26a64cf1d3cd5f4808))
* **deps:** Bump crazy-max/ghaction-import-gpg from 5.1.0 to 5.2.0 ([#7](https://github.com/flex-development/mlly/issues/7)) ([e87d930](https://github.com/flex-development/mlly/commit/e87d9302e3cec93872c4ccf119aba75446839291))
* **deps:** Bump dependabot/fetch-metadata from 1.3.4 to 1.3.5 ([#8](https://github.com/flex-development/mlly/issues/8)) ([9d64f86](https://github.com/flex-development/mlly/commit/9d64f8640e10c7795bda75b183a47ffcbc2c6586))
* **deps:** bump hmarr/debug-action from 2.0.1 to 2.1.0 ([#2](https://github.com/flex-development/mlly/issues/2)) ([3b25af3](https://github.com/flex-development/mlly/commit/3b25af3b01d82dbf195fe5d16686063cfb6533a5))
* **deps:** bump octokit/graphql-action from 2.2.22 to 2.2.23 ([#4](https://github.com/flex-development/mlly/issues/4)) ([93e8994](https://github.com/flex-development/mlly/commit/93e89941b7bd6c5a4539cd1770d400a216c55525))
* **workflows:** `preview` ([2936463](https://github.com/flex-development/mlly/commit/2936463896eec04a5f5025c981d74361f0ee13df))
* **workflows:** deploy docs to production on github release ([876e5b0](https://github.com/flex-development/mlly/commit/876e5b09fe5b8f076133d1bbd78bf02eed206036))
* **workflows:** ensure docs preview is deployed with all `src` updates ([74bdb73](https://github.com/flex-development/mlly/commit/74bdb73a81ebf38fa606f63245140c2c437d20e3))


### :pencil: Documentation

* [`hasESMSyntax`] fix typo in `@return` description ([c9f6a85](https://github.com/flex-development/mlly/commit/c9f6a8571034c82a2ac801db62632f7fc7033efc))
* [site] add `/api/interfaces` ([95eebeb](https://github.com/flex-development/mlly/commit/95eebeb47adc9cbf8e0dc576dbb3211fd241d432))
* [site] add `/api/types` ([cf7f5be](https://github.com/flex-development/mlly/commit/cf7f5be2af20ee33cb6b93a2809eeaf667334d15))
* [site] add `robots.txt` generation to postbuild tasks ([ef98b86](https://github.com/flex-development/mlly/commit/ef98b86bc3e76cf52781495a52bd7b725bdf5db2))
* [site] add esm only warning to install guide ([19dbe66](https://github.com/flex-development/mlly/commit/19dbe662ef869d26d7ac0f5412445dd392116895))
* [site] add google site verification ([8cd42d6](https://github.com/flex-development/mlly/commit/8cd42d6fe457cc342ca22d7130cf5572d81b6e48))
* [site] add initial front-end checklist ([1403dc3](https://github.com/flex-development/mlly/commit/1403dc357ac8db9ee9f3308b93f7d558d48be170))
* [site] algolia search integration ([1af849d](https://github.com/flex-development/mlly/commit/1af849d7be31c618ab6742c4a9ee2cd22038999c))
* [site] configure google analytics ([3c244ec](https://github.com/flex-development/mlly/commit/3c244ec3294b2ff6bcd6afdaf6b3238155ee25a2))
* [site] fix canonical url ([aea7a10](https://github.com/flex-development/mlly/commit/aea7a105d3fa928c52fc5c8a67fc20acb0c6b266))
* [site] fix duplicate meta description ([188d914](https://github.com/flex-development/mlly/commit/188d914bbdd99683a2eeaccb2c4e0080ecba5af3))
* [site] init `/api/` ([a5084d3](https://github.com/flex-development/mlly/commit/a5084d3b1b25b6e33b570e302b91aba41c012075))
* [site] move search indexing to `buildEnd` hook ([4b71095](https://github.com/flex-development/mlly/commit/4b71095d3e8895dcfc9c8355e9c2286da2c5c6d5))
* [site] prevent tab nabbing ([1929374](https://github.com/flex-development/mlly/commit/1929374cf03a52d03216d39a43e1fd94d2f75431))
* [site] specify text directionality ([1807a41](https://github.com/flex-development/mlly/commit/1807a41f31fa1a337be2722dda5771269e121522))
* [site] update front-end checklist ([70fd41d](https://github.com/flex-development/mlly/commit/70fd41d216b6f5d2ceb8f913ea6b87f744c15877))
* [site]: add `/api/constants` ([ed2bb9f](https://github.com/flex-development/mlly/commit/ed2bb9f8d54525a0da49dff9c879a9831cccef2d))
* [site]: resolve `@link` ([6ed82f8](https://github.com/flex-development/mlly/commit/6ed82f84e248a2ea21f73559fa40dba25bd88db5))
* [site]: update `/api/` title and intro ([3e60e88](https://github.com/flex-development/mlly/commit/3e60e884b5e7f551be3621ccbb2c4dabed783f73))
* [site]: update `/api/constants` intro ([2d1d525](https://github.com/flex-development/mlly/commit/2d1d52590e7098006f4df4c58e8d75af2ebb471a))
* init docs site ([df39382](https://github.com/flex-development/mlly/commit/df39382d9472d3eb97eb0eca37fd147634a65ff3))
* merge zsh docs into contributing guide ([f2e2a6c](https://github.com/flex-development/mlly/commit/f2e2a6c64d3cd8cf3376c912236deec7cfab4f37))
* reorganize gpr install guide ([0a8ef6e](https://github.com/flex-development/mlly/commit/0a8ef6ec08490807c3727398ae402d57c4b32f3d))
* temporarily remove `detectSyntax` example ([afc41e9](https://github.com/flex-development/mlly/commit/afc41e9d16c6f869d26db44bbac7579b24f6123c))
* update descriptions and reference links ([8bd5702](https://github.com/flex-development/mlly/commit/8bd570288ef8ed66fce4bd24bf3bc84b9e113dd2))


### :sparkles: Features

* **analyze:** `extractStatements` ([08b9124](https://github.com/flex-development/mlly/commit/08b9124a76e5c4aa182221d87dea903b3876efd4))
* **analyze:** `findDynamicImports` ([a03089a](https://github.com/flex-development/mlly/commit/a03089a6ab374adaa1c0908bf304677f11e8b8e2))
* **analyze:** `findExports` ([7a66d78](https://github.com/flex-development/mlly/commit/7a66d781caa6d5f522d4a51e345eafb16b48974e))
* **analyze:** `findRequires` ([1d58008](https://github.com/flex-development/mlly/commit/1d58008174cc0622c2b1a54ce0dbd8741553cacc))
* **analyze:** `findStaticImports` ([673294c](https://github.com/flex-development/mlly/commit/673294cae8156f26538f7f1db51efcab74678fcc))
* **interfaces:** `CompilerOptionsJson` ([39c1abf](https://github.com/flex-development/mlly/commit/39c1abf9856886566277f771eddf27d3cb6aabd6))
* **interfaces:** `DynamicImport` ([b7474a1](https://github.com/flex-development/mlly/commit/b7474a18e482bd74f9c1337c78adc3299d2b0be5))
* **interfaces:** `ExportStatement` ([4384be4](https://github.com/flex-development/mlly/commit/4384be4525b22858e4cbcc782e5a57352583fd60))
* **interfaces:** `ImportStatement` ([6a16d74](https://github.com/flex-development/mlly/commit/6a16d74c491ee2f0453b31a3ea4bf15b9ab62289))
* **interfaces:** `RequireStatement` ([0dc6d7a](https://github.com/flex-development/mlly/commit/0dc6d7a8cb6a4c00f20621a3232cd0b37476025b))
* **interfaces:** `Statement` ([ec25911](https://github.com/flex-development/mlly/commit/ec25911670d0d204d196eb0039a95948ef7174c1))
* **interfaces:** `StaticImport` ([78816b7](https://github.com/flex-development/mlly/commit/78816b748cde2eec6bbfc821370be46008e46a21))
* **lib:** `getCompilerOptions` ([08c4b84](https://github.com/flex-development/mlly/commit/08c4b8492f7640f74dc676c073a7075115846698))
* **lib:** `isBuiltin` ([b0a618b](https://github.com/flex-development/mlly/commit/b0a618bf910b5a135a0f44df06dffcc0b6747774))
* **lib:** `toDataURL` ([57647dd](https://github.com/flex-development/mlly/commit/57647dd958bc29ff578c1661c3977021034ea5aa))
* **resolve:** [`resolveModule`] `@types` detection ([bcd1de7](https://github.com/flex-development/mlly/commit/bcd1de782395a784e0536f7184072acdaef7f33e))
* **resolve:** `resolveAlias` ([4014515](https://github.com/flex-development/mlly/commit/4014515682448d909fff777d41ed114f2a5ae072))
* **resolve:** `resolveAliases` ([25895cf](https://github.com/flex-development/mlly/commit/25895cf8455d932973593193db50fa28ea882d29))
* **resolve:** `resolveModule` ([90ae6b5](https://github.com/flex-development/mlly/commit/90ae6b55f197d161023119f82d394abb1d2dd5d3))
* **resolve:** `resolveModules` ([e7394ad](https://github.com/flex-development/mlly/commit/e7394ad44ce4965ff2d14ee4a7a7d61a23a7be1e))
* **specifiers:** [`toBareSpecifier`] `@types` detection + `types` entry point support ([6991fae](https://github.com/flex-development/mlly/commit/6991fae7631aa0f2ceb0c3c120349b7d5de55e0e))
* **specifiers:** `toAbsoluteSpecifier` ([83578ac](https://github.com/flex-development/mlly/commit/83578ac87e2600ad1cb7751a260667a13aac77f4))
* **specifiers:** `toBareSpecifier` ([1407d5e](https://github.com/flex-development/mlly/commit/1407d5e059442fec95bd017aa4f8853856cd3166))
* **specifiers:** `toRelativeSpecifier` ([26b7096](https://github.com/flex-development/mlly/commit/26b70967a8d2c06b2449b79002d2ebf7a7bbb990))
* **syntax:** `detectSyntax` ([184950f](https://github.com/flex-development/mlly/commit/184950faba5ee78597b69a2e4b1219338ff56bc7))
* **syntax:** `hasCJSSyntax` ([7d64e65](https://github.com/flex-development/mlly/commit/7d64e657002e4fd6ace32775bb2c274574765781))
* **syntax:** `hasESMSyntax` ([6888620](https://github.com/flex-development/mlly/commit/688862056a14d0ddd633d74cc9708b07b6fc2922))
* **syntax:** detect dynamic imports in commonjs ([05b4d8f](https://github.com/flex-development/mlly/commit/05b4d8f69302d7d6c991bc4dd12a874b0947ca34))
* **types:** `Declaration` ([1427995](https://github.com/flex-development/mlly/commit/1427995fd8999090fd76ae59adb6ecbadf19e263))
* **types:** `Ext` ([2ccd483](https://github.com/flex-development/mlly/commit/2ccd4832690367959ba207df0378409a1d4ee2ab))
* **types:** `MIMEType` ([8ff6a94](https://github.com/flex-development/mlly/commit/8ff6a944207b32f45eddda8a7fd6ac38bf47f634))
* **types:** `SpecifierType` ([6feccb1](https://github.com/flex-development/mlly/commit/6feccb15fca8affeb51efd6ce78f4ae267056910))
* **types:** `StatementType` ([b0feb6c](https://github.com/flex-development/mlly/commit/b0feb6cbf79b5a2d5364b728a2f2a45b8c6f5a50))


### :bug: Fixes

* **docs:** [site] sitemap urls ([95cfad6](https://github.com/flex-development/mlly/commit/95cfad6e10d047d8d9d3bf8ffa0620f50c47472d))
* **internal:** `STATIC_IMPORT_REGEX` matches `:` in ternary statements ([d2027f8](https://github.com/flex-development/mlly/commit/d2027f83515065a28992d6d91ee3e22b2062c1d1))
* **internal:** `STATIC_IMPORT_REGEX` matches `import` in module specifiers ([a58ec20](https://github.com/flex-development/mlly/commit/a58ec2055750747743bc537f32f33ad7676fdcf4))
* **resolve:** [`resolveModules`] ignore dynamic import statements with dynamic specifiers ([48c20bd](https://github.com/flex-development/mlly/commit/48c20bd4915c16914c80e198a420485b9c8a0582))
* **tests:** [`findDynamicImports`] dynamic specifier test ([ee1b01b](https://github.com/flex-development/mlly/commit/ee1b01b6c727b54fecf64b0142ef6409fe30c941))


### :house_with_garden: Housekeeping

* add empty changelog ([7dfb431](https://github.com/flex-development/mlly/commit/7dfb431e5f7ced07d6a9a5028347016f2dd5b4c9))
* disable eslint rule `unicorn/no-unsafe-regex` ([8d24eda](https://github.com/flex-development/mlly/commit/8d24edada5a7c6edfee6d316239cd29dc076531c))
* improve vercel integration ([1db75bc](https://github.com/flex-development/mlly/commit/1db75bc420b42652c440ec0a09742dc319c857f5))
* update editorconfig properties ([60256a8](https://github.com/flex-development/mlly/commit/60256a822ddc721781fe6d6579459fcc9e51a2ec))
* **docs:** scrap `vc dev` usage ([5ce8c0f](https://github.com/flex-development/mlly/commit/5ce8c0f0468b2def494922f8f3b58ebb60a5a19c))
* **github:** add commit scope `analyze` ([f3aaee9](https://github.com/flex-development/mlly/commit/f3aaee92ddbac08744d671cb7b905dbb36dba0f6))
* **github:** add commit scope `docs` ([6111249](https://github.com/flex-development/mlly/commit/61112490c88de111f1906a4725d98abaa5c7247a))
* **github:** add commit scope `interfaces` ([15fc6d9](https://github.com/flex-development/mlly/commit/15fc6d97ff06304710b55bf67768cb14e4ba4295))
* **github:** add commit scope `internal` ([63c3470](https://github.com/flex-development/mlly/commit/63c34707f54d5c5dbeea0ef06d3eea3bd927d888))
* **github:** add commit scope `specifiers` ([a7b3eb3](https://github.com/flex-development/mlly/commit/a7b3eb32b6cced07607af5be3f7c5c1240bcf3c2))
* **github:** add commit scope `types` ([da9f588](https://github.com/flex-development/mlly/commit/da9f588beac0d8e00daa60e40739306e424a3fa7))
* **github:** add label `scope:docs` ([6a98495](https://github.com/flex-development/mlly/commit/6a98495c6f1feabe786509c4bfc5aa6cb63573cb))
* **github:** add label `scope:internal` ([daca7af](https://github.com/flex-development/mlly/commit/daca7afda87a3f1dd2d292ed5e06cde42b3d5929))
* **ts:** enforce `import type` for type-only imports ([acd84b8](https://github.com/flex-development/mlly/commit/acd84b8c004fce22da9b2ea16b5281089fb5b15d))


### :fire: Performance Improvements

* **docs:** [site] improve speed of first search query ([0ad65db](https://github.com/flex-development/mlly/commit/0ad65db1a6f731f7452d40375359f7584266a5d1))
* **docs:** [site] use exact urls to increase speed ([55c1267](https://github.com/flex-development/mlly/commit/55c1267864fe9540c38cd8e5bc970a855cd497bf))


### :zap: Refactors

* **docs:** [site] comments compilation ([f66861c](https://github.com/flex-development/mlly/commit/f66861c9dca4e2f17403d8bc5684c2f120d4ebaa))
* **interfaces:** `AliasResolverOptions` -> `ResolveAliasOptions` ([602d11a](https://github.com/flex-development/mlly/commit/602d11a71c6ee288e7f73454a49cfdaaa5e71cc5))
* **internal:** add internals ([7a486c7](https://github.com/flex-development/mlly/commit/7a486c7ed3c84f39b0b4b7143f92729ce7912d81))
* **lib:** move `getCompilerOptions` to `internal` ([7c5656d](https://github.com/flex-development/mlly/commit/7c5656d70bd67c18a9c126abb6e84ff838552ad8))
* **lib:** replace `isBuiltin` with `@flex-development/is-builtin` ([c868cec](https://github.com/flex-development/mlly/commit/c868cec9b5fce91014b1666b3f9aceef60acf079))
* **resolve:** [`resolveAliases`] signature ([190fb52](https://github.com/flex-development/mlly/commit/190fb5260adb4559beaf0f3666c68b1cc1a16094))
* **resolve:** [options] allow readonly arrays ([6df4a4b](https://github.com/flex-development/mlly/commit/6df4a4bb3836adef0b6f15884575edb6ce78c2a0))
* **resolve:** [options] pass original module specifier to `ext` ([4615851](https://github.com/flex-development/mlly/commit/46158510fdd0e3d8e0e60757290a655606ad836e))
* **resolve:** sort `RESOLVE_EXTENSIONS` according to priority ([0266ca9](https://github.com/flex-development/mlly/commit/0266ca9a5593d0c66e950ba1fe2c8f6df8422ff9))
* **specifiers:** [`toBareSpecifier`] improve `exports` path search ([36c4b74](https://github.com/flex-development/mlly/commit/36c4b7475c9bb6c924f5e75c8d6d215a8d23e79c))
