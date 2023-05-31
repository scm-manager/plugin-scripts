# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.4.0
### Changed
- Add @scm-manager/ui-layout to externals

## 1.3.0
### Changed
- Add @scm-manager/ui-forms, @scm-manager/ui-buttons and @scm-manager/ui-overlays to externals

### Fixed
- Fix live reload on Windows ([#2](https://github.com/scm-manager/plugin-scripts/pull/2))

## 1.2.2 - 2021-11-18
### Fixed
- Set 'publicPath' in 'output' to empty string (see [webpack documentation](https://webpack.js.org/configuration/output/#outputpublicpath))

## 1.2.1 - 2021-11-02
### Changed
* Improve error handling

### Fixed
* Resolve webpack loader when used for core plugin

## 1.2.0 - 2021-10-28
### Changed
* Update webpack to v5

## 1.1.0 - 2021-05-11
### Added
* Mark react-hook-form, react-query and @scm-manager/ui-api as externals

## 1.0.3 - 2021-04-30

### Fixed
* package.json sync of new plugins

## 1.0.2 - 2021-01-28

### Fixed
* `watch` on Mac OS X Big Sur

## 1.0.1 - 2020-12-16

### Fixed
* Dangling watch process on linux if parent process dies
