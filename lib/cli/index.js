#!/usr/bin/env node

const path = require("path");
const { merge } = require("lodash");
const build = require("./utils/buildLog.util");

function parsePluginsConfig(config) {
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
    return config.reduce(
        (acc, item) => merge(acc, makeNestedObject(item.split("."))),
        {}
    );
}
// noinspection BadExpressionStatementJS
require("yargs")(
    ![...process.argv].slice(2).length ? ["--help"] : process.argv.slice(2)
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
                    "pass Inspect argument (--inspect) to each Dedicated Module",
                default: false,
                type: "boolean",
            },
            entry: {
                alias: "e",
                description: "Entry point",
                default: "src/index.js",
                type: "string",
            },
            "assets-folder": {
                alias: "a",
                description: "Assets folder",
                default: "src/assets",
                type: "string",
            },
            "build-folder": {
                alias: "b",
                description: "Folder where built files will be placed",
                default: ".devbuild",
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
        },
        async (args) =>
            build({
                buildFolder: args.b,
                buildType: "development",
                entry: path.resolve(process.cwd(), args.entry),
                assetsFolder: args.a,
                debug: args.debug,
                watch: true,
                webpackStats: false,
                plugins: args.plugin,
                pluginsConfig: parsePluginsConfig(args.l),
            })
    )
    .command(
        "build",
        "Build Project Components",
        {
            entry: {
                alias: "e",
                description: "Entry point",
                default: "src/index.js",
                type: "string",
            },
            "assets-folder": {
                alias: "a",
                description: "Assets folder",
                default: "src/assets",
                type: "string",
            },
            type: {
                alias: "t",
                description: "Build type",
                choices: ["module", "frame"],
                default: "module",
                type: "string",
            },
            "build-folder": {
                alias: "b",
                description: "Folder where built files will be placed",
                default: "build",
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
                pluginsConfig: parsePluginsConfig(args.l),
            })
    )
    .help().argv;
