#!/usr/bin/env node

const path = require("path");
const { merge } = require("lodash");
const build = require("./utils/buildLog.util");

const safeObjectRequire = (configPath) => {
    if (!configPath) return {};
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const pathSource = require(require.resolve(configPath));
    if (typeof pathSource !== "object")
        throw new Error("passed plugins-config-file file should be an object");
    return pathSource;
};

function parsePluginsConfig(baseObject, inlineConfig) {
    const makeNestedObject = (leftArray) =>
        leftArray.length === 1
            ? {
                  [leftArray[0].split("=")[0]]: leftArray[0]
                      .split("=")
                      .slice(1)
                      .join("="),
              }
            : {
                  [leftArray[0]]: makeNestedObject(leftArray.slice(1)),
              };
    return inlineConfig.reduce(
        (acc, item) => merge(acc, makeNestedObject(item.split("."))),
        baseObject,
    );
}

const baseBuildParams = {
    entry: {
        alias: "e",
        description: "Entry point",
        default: "src/index.js",
        type: "string",
    },
    "assets-folder": {
        alias: "a",
        description: "Assets folder",
        default: null,
        type: "string",
    },
    plugin: {
        alias: "p",
        description: "Builder plugins",
        default: [],
        type: "array",
    },
    "plugin-config": {
        alias: "l",
        desc: "Builder plugin options",
        default: [],
        type: "array",
    },
    "plugins-config-file": {
        alias: "c",
        desc: "Builder plugins config file",
        default: "",
        type: "string",
    },
};

// noinspection BadExpressionStatementJS
require("yargs")(
    ![...process.argv].slice(2).length ? ["--help"] : process.argv.slice(2),
)
    .scriptName("elion-builder")
    .version("default")
    .usage("$0 <cmd> [args]")
    .command(
        "start",
        "Start Development Server",
        {
            debug: {
                alias: "d",
                description:
                    "pass Inspect argument (--inspect) to started process",
                default: false,
                type: "boolean",
            },
            argument: {
                alias: "g",
                description:
                    "pass argument to started process (max_old_space_size=4096)",
                default: [],
                type: "array",
            },
            "build-folder": {
                alias: "b",
                description:
                    'Folder where built files will be placed (you can pass "tmp" folder for this)',
                default: ".devbuild",
                type: "string",
            },
            ...baseBuildParams,
        },
        async (args) =>
            build({
                buildFolder: args.b,
                buildType: "development",
                entry: path.resolve(process.cwd(), args.entry),
                assetsFolder: args.a,
                debug: args.debug,
                startArguments: args.g || [],
                watch: true,
                webpackStats: false,
                plugins: args.plugin,
                pluginsConfig: parsePluginsConfig(
                    safeObjectRequire(args.c),
                    args.l,
                ),
            }),
    )
    .command(
        "build",
        "Build Project Components",
        {
            "build-folder": {
                alias: "b",
                description: "Folder where built files will be placed",
                default: "build",
                type: "string",
            },
            "keep-classnames": {
                description: "Keep classnames in production build",
                default: false,
                type: "boolean",
            },
            ...baseBuildParams,
        },
        async (args) =>
            build({
                buildFolder: args.b,
                buildType: "production",
                entry: path.resolve(process.cwd(), args.entry),
                assetsFolder: args.a,
                debug: false,
                watch: false,
                webpackStats: true,
                plugins: args.plugin,
                pluginsConfig: parsePluginsConfig(
                    safeObjectRequire(args.c),
                    args.l,
                ),
                keepClassNames: args["keep-classnames"],
            }),
    )
    .help().argv;
