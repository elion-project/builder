# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [5.0.1](https://github.com/elion-project/builder/compare/v5.0.0...v5.0.1) (2024-01-31)


### Bug Fixes

* Upgrade dependencies; Update `LICENSE` year; Add release commands ([0d3ae22](https://github.com/elion-project/builder/commit/0d3ae22f955d1f32140931f95ef4c8222aabb1ba))

## [5.0.0](https://github.com/elion-project/builder/compare/v4.0.1...v5.0.0) (2023-11-20)


### ⚠ BREAKING CHANGES

* Drop `Node.js v16` support. Upgrade dependencies. Upgrade `LICENSE` year.

### Features

* Drop `Node.js v16` support. Upgrade dependencies. Upgrade `LICENSE` year. ([f60e073](https://github.com/elion-project/builder/commit/f60e073c86686beb6183664a4d395661f0fd34ab))

### [4.0.1](https://github.com/elion-project/builder/compare/v4.0.0...v4.0.1) (2023-08-16)


### Bug Fixes

* update docs ([c20d40c](https://github.com/elion-project/builder/commit/c20d40c7a81676a192aa3ea79a42ad9c519b8dca))

## [4.0.0](https://github.com/elion-project/builder/compare/v3.2.1...v4.0.0) (2023-08-16)


### ⚠ BREAKING CHANGES

* `assets-folder` parameter now is `null` by default.

### Features

* `assets-folder` parameter now is `null` by default. ([2b0c4ec](https://github.com/elion-project/builder/commit/2b0c4ec6c232263299ff76f79b9489872e362bea))
* remove `TerserPlugin`. Update `tmp` output imports ([78f41bf](https://github.com/elion-project/builder/commit/78f41bf5444480dc0e63e66b94ebe5afcefce73f))


### Bug Fixes

* approve code styling ([3ef7d14](https://github.com/elion-project/builder/commit/3ef7d141ef551510f985ecf27ae07760ebdaaec1))
* Update packages ([5635f2b](https://github.com/elion-project/builder/commit/5635f2b7156365b081faf2c30029969af2389846))

### [3.2.1](https://github.com/elion-project/builder/compare/v3.2.0...v3.2.1) (2023-08-16)


### Bug Fixes

* lag when no previous plugins selected ([62be36e](https://github.com/elion-project/builder/commit/62be36eb48045ddc39a8ddba46f99282287543fa))

## [3.2.0](https://github.com/elion-project/builder/compare/v3.1.0...v3.2.0) (2023-06-15)


### Features

* Add support of tmp folder ([8c57a06](https://github.com/elion-project/builder/commit/8c57a06f17c264280ca313cdac1191863ad159f7))

## [3.1.0](https://github.com/elion-project/builder/compare/v3.0.7...v3.1.0) (2023-06-14)


### Features

* Add support of plugin variables ([6b26950](https://github.com/elion-project/builder/commit/6b26950e415fac1556d521db551c27f553420d2f))

### [3.0.7](https://github.com/elion-project/builder/compare/v3.0.6...v3.0.7) (2023-05-27)


### Bug Fixes

* Upgrade project dependencies. ([f725ab9](https://github.com/elion-project/builder/commit/f725ab928ff98b4da144740579c3114bb6372811))

### [3.0.6](https://github.com/elion-project/builder/compare/v3.0.5...v3.0.6) (2023-04-23)


### Bug Fixes

* Update dependencies ([58ed3c2](https://github.com/elion-project/builder/commit/58ed3c27a83065c5e54c86524e9f67259ac2ab66))

### [3.0.5](https://github.com/elion-project/builder/compare/v3.0.4...v3.0.5) (2023-03-26)


### Bug Fixes

* Add `additionalModuleDirs` from `entry` path ([e0fab59](https://github.com/elion-project/builder/commit/e0fab599c58b325a57390d9501f820a6900d36e5))

### [3.0.4](https://github.com/elion-project/builder/compare/v3.0.3...v3.0.4) (2023-03-14)


### Bug Fixes

* Packages update ([d742cec](https://github.com/elion-project/builder/commit/d742cec650d7b2fc267c62c9d2c6108dc6fdc948))
* Update errorModifier.util.js ([c1e8c4c](https://github.com/elion-project/builder/commit/c1e8c4c231b5f71fd7fb53d1dd13c9b7b970164d))

### [3.0.3](https://github.com/elion-project/builder/compare/v3.0.2...v3.0.3) (2023-02-14)


### Bug Fixes

* Added `js` loader param for `defaultJsLoader` ([b7d5f8d](https://github.com/elion-project/builder/commit/b7d5f8d8c7449ae73b035b3294ef79bacc562f20))

### [3.0.2](https://github.com/elion-project/builder/compare/v3.0.1...v3.0.2) (2023-02-12)


### Bug Fixes

* Updated README.MD and CONTRIBUTING.md ([e28fdf5](https://github.com/elion-project/builder/commit/e28fdf5e162986010e3fd1c7e793e378501e0d83))

### [3.0.1](https://github.com/elion-project/builder/compare/v3.0.0...v3.0.1) (2023-02-12)


### Bug Fixes

* Resolved some code smells ([d0f4537](https://github.com/elion-project/builder/commit/d0f4537ca4eaceb84a88495c9171698cfd3818b4))

## [3.0.0](https://github.com/elion-project/builder/compare/v2.6.0...v3.0.0) (2023-02-12)

### Features

* move `index.js` into `src/index.js` (example) ([760bbc6](https://github.com/elion-project/builder/commit/760bbc6d892a9098268d0a2ec666afb5d1ca64ec))


### Bug Fixes

* Upgrade error post-processing ([494d70b](https://github.com/elion-project/builder/commit/494d70b97f5fb906c94f03b5eb54c1f376b6cc6d))

### BREAKING CHANGES
* BREAKING: moved from @babel to [esbuild](https://esbuild.github.io/). Updated documentation. Terser minimizer plugin is now deprecated ([9f9d568](https://github.com/elion-project/builder/commit/9f9d568bd382c0911942eb29e536177db9de5641))

### [2.5.1](https://github.com/elion-project/builder/compare/v2.5.0...v2.5.1) (2023-01-13)


### Bug Fixes

* Deny class and function name changing ([1b38537](https://github.com/elion-project/builder/commit/1b3853727dcaa002405a66d83efc507fb5d64d85))

## [2.5.0](https://github.com/elion-project/builder/compare/v2.4.0...v2.5.0) (2023-01-13)


### Features

* Update deps ([8cfcbe2](https://github.com/elion-project/builder/commit/8cfcbe274e26a4a1c368f9c0fcac24b9c954f142))

## [2.4.0](https://github.com/elion-project/builder/compare/v2.3.2...v2.4.0) (2022-11-05)


### Features

* Updated deps ([6f10027](https://github.com/elion-project/builder/commit/6f100276fb98820eaf191fa5517e5373d9864e66))

### [2.3.2](https://github.com/elion-project/builder/compare/v2.3.1...v2.3.2) (2022-11-05)


### Bug Fixes

* remove all nested components and move to allowList ([13ad086](https://github.com/elion-project/builder/commit/13ad086ba2047f971e40804bbc745ea8e867bd61))

### [2.3.1](https://github.com/elion-project/builder/compare/v2.3.0...v2.3.1) (2022-11-04)


### Bug Fixes

* Add buffer-from ([d0a7996](https://github.com/elion-project/builder/commit/d0a7996f17b473ea91e0bdbb24da2062304d5a95))

## [2.3.0](https://github.com/elion-project/builder/compare/v2.2.0...v2.3.0) (2022-10-27)


### Features

* add ability to pass plugins-object-config ([446ff87](https://github.com/elion-project/builder/commit/446ff87f6c9270fa3e5e51623443d9de49fb5a13))


### Bug Fixes

* `moveCursor` function is not avaliable on Ubuntu, so use `try...catch` for it ([8514b50](https://github.com/elion-project/builder/commit/8514b50559ddd80b548220881f3f753f7a95981a))
* add build folder to ignore ([8aba025](https://github.com/elion-project/builder/commit/8aba02599a6249c2e844617f8476acffc2b448cd))
* add soruce-map to included deps ([9995db9](https://github.com/elion-project/builder/commit/9995db9ad4aabd874e5dec2c2b5968cbab950a0c))
* bad resolving `exports` when build ([b55542c](https://github.com/elion-project/builder/commit/b55542cda31493295ea5a1566de1c657591487e6))

## [2.2.0](https://github.com/elion-project/builder/compare/v2.1.3...v2.2.0) (2022-10-16)


### Features

* add ESM support of dynamic import ([6f52d54](https://github.com/elion-project/builder/commit/6f52d542691d075394508fc223186d8c60855a04))

### [2.1.3](https://github.com/elion-project/builder/compare/v2.1.2...v2.1.3) (2022-10-16)

### [2.1.2](https://github.com/elion-project/builder/compare/v2.1.1...v2.1.2) (2022-10-16)

### [2.1.1](https://github.com/elion-project/builder/compare/v2.1.0...v2.1.1) (2022-10-16)

## [2.1.0](https://github.com/elion-project/builder/compare/v2.0.0...v2.1.0) (2022-10-16)


### Features

* create plugin for `ESM` integration ([b9f952e](https://github.com/elion-project/builder/commit/b9f952e12e259bf7b06b409896c7850fd14a5e15))
* Update example project ([9e08a37](https://github.com/elion-project/builder/commit/9e08a37f48fb3a631005ea8d8c0981c81ebf1b38))

## [2.0.0](https://github.com/elion-project/builder/compare/v1.5.0...v2.0.0) (2022-10-15)


### ⚠ BREAKING CHANGES

* move `rust-wasmpack-loader` to plugin.

### major

* move `rust-wasmpack-loader` to plugin. ([de282f4](https://github.com/elion-project/builder/commit/de282f4b0be07072ef599cf1bb6e3a47760f5c60))

## [1.5.0](https://github.com/elion-project/builder/compare/v1.4.0...v1.5.0) (2022-09-18)

## [1.4.0](https://github.com/elion-project/builder/compare/v1.3.2...v1.4.0) (2022-09-15)

### [1.3.2](https://github.com/elion-project/builder/compare/v1.3.1...v1.3.2) (2022-09-15)

### 1.3.1 (2022-09-15)
