## [1.7.12](https://github.com/resourge/react-router/compare/v1.7.11...v1.7.12) (2023-03-15)


### Bug Fixes

* **geturlpattern:** fix previous commit making other urls not working as intended ([225ca64](https://github.com/resourge/react-router/commit/225ca640210c9f0fc410e9bd4f381467b606dac7))

## [1.7.11](https://github.com/resourge/react-router/compare/v1.7.10...v1.7.11) (2023-03-15)


### Bug Fixes

* **geturlpattern:** fix param inside hash not working as intended ([79c3c8d](https://github.com/resourge/react-router/commit/79c3c8ddcc1daec69b990c56c646b5c92aa8ef3c))

## [1.7.10](https://github.com/resourge/react-router/compare/v1.7.9...v1.7.10) (2023-03-15)


### Bug Fixes

* **geturlpattern:** add unitary testing to prevent url's not working ([ee46029](https://github.com/resourge/react-router/commit/ee46029b20712bf45fe45360112c208367245a90))

## [1.7.9](https://github.com/resourge/react-router/compare/v1.7.8...v1.7.9) (2023-03-15)


### Bug Fixes

* **geturlpattern:** fix pattern not working without a final / ([4d3734c](https://github.com/resourge/react-router/commit/4d3734ca0109bf5fc05e3e2a1edb4c0751b2dbf4))

## [1.7.8](https://github.com/resourge/react-router/compare/v1.7.7...v1.7.8) (2023-03-02)


### Bug Fixes

* **geturlpattern:** fix pattern not working as intended with hash ([0143fee](https://github.com/resourge/react-router/commit/0143fee233d1081a475735f9e1125d30acf24c17))

## [1.7.7](https://github.com/resourge/react-router/compare/v1.7.6...v1.7.7) (2023-03-01)


### Bug Fixes

* **params:** fix params not working as intended when using multiple paths ([c5682a3](https://github.com/resourge/react-router/commit/c5682a3b6187bc0f23e03fda554f84b1fce9b042))

## [1.7.6](https://github.com/resourge/react-router/compare/v1.7.5...v1.7.6) (2023-02-28)


### Bug Fixes

* **generatepath:** fix path not working with optional values ([76e515b](https://github.com/resourge/react-router/commit/76e515b89436337b943ac320a428baa49813f58d))

## [1.7.5](https://github.com/resourge/react-router/compare/v1.7.4...v1.7.5) (2023-02-28)


### Bug Fixes

* **resourge/react-search-params:** update resourge/react-search-params to fix some bugs ([1f2690d](https://github.com/resourge/react-router/commit/1f2690d01bd6d93a4eeba3b559392dc8e51df168))

## [1.7.4](https://github.com/resourge/react-router/compare/v1.7.3...v1.7.4) (2023-02-28)


### Bug Fixes

* **navigate:** fix Navigate component pushing instead of replacing url's ([ee7657c](https://github.com/resourge/react-router/commit/ee7657cb8b61ed8bb0d6732fee3b27ab162745a4))
* **useblocker:** change from routeUrl to actual url ([11c772b](https://github.com/resourge/react-router/commit/11c772b842528ee6c7e7bcc69614c33a1afdfb5d))

## [1.7.3](https://github.com/resourge/react-router/compare/v1.7.2...v1.7.3) (2023-02-24)


### Bug Fixes

* **usematchroute:** fix parentRoute error when RouteContext is null ([39aaa2f](https://github.com/resourge/react-router/commit/39aaa2f36bff4b3a2fb96e7fe2b7cac8874e3c7d))

## [1.7.2](https://github.com/resourge/react-router/compare/v1.7.1...v1.7.2) (2023-02-24)


### Bug Fixes

* **useprompt:** trigger new versino ([a72759c](https://github.com/resourge/react-router/commit/a72759c7a1d1d6d2f03cfaca4b2dd45f2469af69))

## [1.7.1](https://github.com/resourge/react-router/compare/v1.7.0...v1.7.1) (2023-02-22)


### Bug Fixes

* **path:** fix includeCurrentURL not being true by default ([b72359d](https://github.com/resourge/react-router/commit/b72359d44a0795f1b99d91f5b7a4faf21289689f))

# [1.7.0](https://github.com/resourge/react-router/compare/v1.6.1...v1.7.0) (2023-02-21)


### Bug Fixes

* **path:** fix hash type not working as intended ([b1ae0ea](https://github.com/resourge/react-router/commit/b1ae0ea1d289cdfe9216289cec5f3b5113936177))
* **route/switch:** fix undefined path not work as intended ([60ac20b](https://github.com/resourge/react-router/commit/60ac20b2a0eab77e232ae523ad2d47766f96cfa1))
* **setuppaths:** fix types ([cfefe28](https://github.com/resourge/react-router/commit/cfefe282b408146791cb0541ce02ba4b3c6b2ac9))


### Features

* **switch:** add ability to also use components without path inside ([52e93d5](https://github.com/resourge/react-router/commit/52e93d545859a0acff282ec749c35673d08d553e))

## [1.6.1](https://github.com/resourge/react-router/compare/v1.6.0...v1.6.1) (2023-02-17)


### Bug Fixes

* **route:** fix a bug where cloneElement was not including the component children ([d2a78c0](https://github.com/resourge/react-router/commit/d2a78c0e23d6a8d7f9277b7e737c8179bceac4d4))

# [1.6.0](https://github.com/resourge/react-router/compare/v1.5.1...v1.6.0) (2023-02-17)


### Features

* **setuptypes:** remove folder separation ([a43b411](https://github.com/resourge/react-router/commit/a43b4117e6c8f49965d09414c6b4da4a6b48d4a2))

## [1.5.1](https://github.com/resourge/react-router/compare/v1.5.0...v1.5.1) (2023-02-17)


### Bug Fixes

* **useswitch:** fix bug where not having path was giving an error ([9615e35](https://github.com/resourge/react-router/commit/9615e35d75056901b55ca6a233dd52aaaa11919e))

# [1.5.0](https://github.com/resourge/react-router/compare/v1.4.1...v1.5.0) (2023-02-17)


### Features

* **route:** make path not mandatory ([6c32a61](https://github.com/resourge/react-router/commit/6c32a614a3d5bced24e7508d5921a539c35b8b24))

## [1.4.1](https://github.com/resourge/react-router/compare/v1.4.0...v1.4.1) (2023-01-17)


### Bug Fixes

* **setuppaths:** fix param not injected into routes params and update variables names ([eae5ccf](https://github.com/resourge/react-router/commit/eae5ccf38aa1a140daef76cdb2f8d3d42fdb35db))

# [1.4.0](https://github.com/resourge/react-router/compare/v1.3.1...v1.4.0) (2023-01-13)


### Features

* **useblocker and useprompt:** update to also include a ways to finishBlocking ([0a3bc4d](https://github.com/resourge/react-router/commit/0a3bc4da240fe74b966464e9f617bf9b675d817e))

## [1.3.1](https://github.com/resourge/react-router/compare/v1.3.0...v1.3.1) (2023-01-03)


### Bug Fixes

* **useswitch:** fix useswich not working as intended ([609b6e3](https://github.com/resourge/react-router/commit/609b6e3f0c2f3ca6f7fff406654eae9db43cdc00))

# [1.3.0](https://github.com/resourge/react-router/compare/v1.2.1...v1.3.0) (2022-12-20)


### Features

* **package.json:** update package versions ([1155766](https://github.com/resourge/react-router/commit/1155766cdd0b16b661749b6670cc411bf9342a10))

## [1.2.1](https://github.com/resourge/react-router/compare/v1.2.0...v1.2.1) (2022-12-19)


### Bug Fixes

* **switch:** fix Switch not working with 'no exact' route paths ([a946787](https://github.com/resourge/react-router/commit/a9467879a99d9996c805ee1a3540633cc9587966))

# [1.2.0](https://github.com/resourge/react-router/compare/v1.1.4...v1.2.0) (2022-10-11)


### Bug Fixes

* **validaterouteprops:** fix message showing the wrong error ([084b6e1](https://github.com/resourge/react-router/commit/084b6e1ed5ad54a1ce33587d90fc4d892c57523e))


### Features

* **package.json:** update @resourge/react-search-params to latest version ([936361a](https://github.com/resourge/react-router/commit/936361ae1b86ca0327a193cb07ca5f3f322faa6e))

## [1.1.4](https://github.com/resourge/react-router/compare/v1.1.3...v1.1.4) (2022-10-10)


### Bug Fixes

* **param:** fix param not working ([e21515e](https://github.com/resourge/react-router/commit/e21515eff0a1ba3626e012f368b75a00ff9e50ed))

## [1.1.3](https://github.com/resourge/react-router/compare/v1.1.2...v1.1.3) (2022-10-06)


### Bug Fixes

* **generatepath:** update generatePath regex with new optional param pattern ([d471fb8](https://github.com/resourge/react-router/commit/d471fb8be2bc200e8617bf16fef9b4741d095579))

## [1.1.2](https://github.com/resourge/react-router/compare/v1.1.1...v1.1.2) (2022-10-06)


### Bug Fixes

* **params.ts:** change the way optional params are defined to match URLPattern optional params ([3397fde](https://github.com/resourge/react-router/commit/3397fdebcd99a393c291a6cf96304f617d355276))

## [1.1.1](https://github.com/resourge/react-router/compare/v1.1.0...v1.1.1) (2022-10-03)


### Bug Fixes

* **hooks/index.ts:** add useAction to export ([0917166](https://github.com/resourge/react-router/commit/09171660319f90fc2c15bb1e910ac1d25fe6e21e))

# [1.1.0](https://github.com/resourge/react-router/compare/v1.0.3...v1.1.0) (2022-10-03)


### Features

* **package.json:** update @resourge/react-search-params to latest version ([1816fea](https://github.com/resourge/react-router/commit/1816fea8fa840db40438bbfd058e6bf9756bf9e8))

## [1.0.3](https://github.com/resourge/react-router/compare/v1.0.2...v1.0.3) (2022-09-29)


### Bug Fixes

* **setuppaths:** fix setuppaths on subpaths without parent path having label ([152a930](https://github.com/resourge/react-router/commit/152a930ac81e2167751a581db3664b032f915af6))

## [1.0.2](https://github.com/resourge/react-router/compare/v1.0.1...v1.0.2) (2022-09-29)


### Bug Fixes

* **index.d.ts:** fix types using wrong files ([b0c4816](https://github.com/resourge/react-router/commit/b0c481615721163f944b0d504298be0f9955b493))

## [1.0.1](https://github.com/resourge/react-router/compare/v1.0.0...v1.0.1) (2022-09-26)


### Bug Fixes

* **rollup.config.js:** change to jsx-runtime ([2cefadb](https://github.com/resourge/react-router/commit/2cefadb89d71b71aeec420205bb36f6ff180ceae))

# 1.0.0 (2022-09-26)


### Features

* **project:** first release ([8a7b3f8](https://github.com/resourge/react-router/commit/8a7b3f87e5509093d0184e0f0831e862625edfa4))
