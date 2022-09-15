#!/usr/bin/env node

const path = require("path");
const build = require("./build");
const startScreen = require("../utils/start.util");

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
                description: "entry point",
                default: "src/index.js",
                type: "string",
            },
            "build-folder": {
                alias: "b",
                description: "Folder where built files will be placed",
                default: ".devbuild",
                type: "string",
            },
        },
        async (args) => {
            await startScreen();
            return build({
                buildFolder: args.b,
                buildType: "development",
                entry: path.resolve(process.cwd(), args.entry),
                debug: args.debug,
                watch: true,
            });
        }
    )
    .command(
        "build",
        "Build Project Components",
        {
            entry: {
                alias: "e",
                description: "entry point",
                default: "src/index.js",
                type: "string",
            },
            type: {
                alias: "t",
                description: "Build type",
                choices: ["module", "frame"],
                default: "module",
                type: "string",
            },
            plugin: {
                alias: "p",
                description: "Build Plugins",
                type: "array",
            },
            "build-folder": {
                alias: "b",
                description: "Folder where built files will be placed",
                default: "build",
                type: "string",
            },
        },
        async (args) => {
            await startScreen();
            return build({
                buildFolder: args.b,
                buildType: "production",
                entry: path.resolve(process.cwd(), args.entry),
                debug: false,
                watch: false,
            });
        }
    )
    .help().argv;
