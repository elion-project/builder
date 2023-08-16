[![MIT License](https://img.shields.io/npm/l/@node-elion/builder.svg?)](https://www.npmjs.com/package/@node-elion/builder)
[![View this project on NPM](https://img.shields.io/npm/v/@node-elion/builder.svg)](https://npmjs.org/package/@node-elion/builder)
[![View this project on NPM](https://img.shields.io/npm/dm/@node-elion/builder.svg)](https://npmjs.org/package/@node-elion/builder)
[![Known Vulnerabilities](https://snyk.io/test/github/elion-project/builder/badge.svg)](https://snyk.io/test/github/elion-project/builder)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=elion-project_builder&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=elion-project_builder)

# @node-elion/builder

this package is part of the [Elion project](https://github.com/elion-project).

This package was created to be able quickly and painlessly build `js/ts` files while ignoring problems
with `commonJS/ESM` modules. To get started, you just need to install this package and change the project's build
configuration

## Installation

Install `@node-elion/builder` with npm

> This package is recommended to be installed as a dev dependency

```shell
npm i --save-dev @node-elion/builder
```

## Usage

Update `package.json` to be able to use `@node-elion/builder` package:

```json5
/* package.json */
{
    /*...*/
    "scripts": {
        "start": "ebi start",
        "build": "ebi build"
    }
    /*...*/
}
```

## CLI commands

### `ebi start`

|               parameter | alias |    type    |    default     | description                                                                                                           |
|------------------------:|:-----:|:----------:|:--------------:|-----------------------------------------------------------------------------------------------------------------------|
|               `--entry` | `-e`  |  `string`  | `src/index.js` | sets entry to your application. This is usually the root file, in which all necessary processes are imported and run. |
|       `--assets-folder` | `-a`  | `string `  |  `src/assets`  | files (like`.tf` or `.json` etc.) that should be stored in raw format                                                 |
|              `--plugin` | `-p`  | `string[]` |      `[]`      | Builder plugins                                                                                                       |
|       `--plugin-config` | `-l`  | `string[]` |      `[]`      | Plugin config                                                                                                         |
| `--plugins-config-file` | `-c`  |  `string`  |                | Plugin config file (should be `.json` format)                                                                         |
|               `--debug` | `-d`  | `boolean`  |    `false`     | pass Inspect argument (`--inspect`) to started process                                                                |
|        `--build-folder` | `-b`  |  `string`  | `./.devbuild`  | Folder, where built files will be stored (you can use `tmp` for in order to use the temporary folder of your device)  | 

### `ebi build`

|               parameter | alias |    type    |    default     | description                                                                                                           |
|------------------------:|:-----:|:----------:|:--------------:|-----------------------------------------------------------------------------------------------------------------------|
|               `--entry` | `-e`  |  `string`  | `src/index.js` | sets entry to your application. This is usually the root file, in which all necessary processes are imported and run. |
|       `--assets-folder` | `-a`  | `string `  |  `src/assets`  | files (like`.tf` or `.json` etc.) that should be stored in raw format                                                 |
|              `--plugin` | `-p`  | `string[]` |      `[]`      | Builder plugins                                                                                                       |
|       `--plugin-config` | `-l`  | `string[]` |      `[]`      | Plugin config                                                                                                         |
| `--plugins-config-file` | `-c`  |  `string`  |                | Plugin config file (should be `.json` format)                                                                         |
|        `--build-folder` | `-b`  |  `string`  |   `./build`    | Folder, where built files will be stored                                                                              |
|     `--keep-classnames` |       | `boolean`  |    `false`     | Keep classnames in production build                                                                                   |

## Examples

Check the **[examples](./examples)** folder for a better understanding of how the loader works

## Contributing

Contributions are always welcome!

See [CONTRIBUTING.md](./CONTRIBUTING.md) for ways to get started.

## Acknowledgements

- [webpack](https://github.com/webpack/webpack)
- [esbuild](https://esbuild.github.io/)

## License

[MIT](https://choosealicense.com/licenses/mit/)
