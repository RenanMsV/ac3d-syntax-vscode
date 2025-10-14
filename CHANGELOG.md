# Change Log

All notable changes to the "Inivis AC3D Syntax" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.1] - 2025-10-13

### Changed

- Reduced icon size from 15kb to 1.7kb (Lossly Compressed).
- Improved snippets file.
- Updated VSCode engine requirement to ^1.105.0.
- Internal changes for CI/CD workflows.
- Versioning changed. Next release after 0.0.3 becomes 0.3.1.

### Added

- Implemented a basic Language Server Protocol (LSP).
- Added a basic hover provider to display information on hover of certain elements.
- Integrated a Color Picker functionality for MATERIAL lines.
- Provided a Link Provider function for texture lines.
- Enabled code folding for certain element blocks.
- Added a basic Completion Provider.
- Added Tests with @vscode/test-cli.
- Added a default icon to the language.
- Added ESLint configuration for improved code quality.

### Fixed

- Corrected the link in the README.

## [0.0.3] - 2022-11-17

### Changed

- Display name changed from "AC3D-Syntax" to "Inivis AC3D Syntax".

### Added

- Additional information to the readme.
- Missing keywords added: texrep and texoff.

### Fixed

- Badges of readme not showing, changed to [shields.io](https://shields.io).

## [0.0.2] - 2019-09-04

### Added

- Badges to the readme.
- Gitignore.

## [0.0.1] - 2019-08-21

### Added

- LICENSED over GPL-3.
- Added basic snippets.
- Added basic Syntax highlighting for AC3D files.
