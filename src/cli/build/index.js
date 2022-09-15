const webpack = require("webpack");
const WebpackCLI = require("webpack-cli");
const path = require("path");
const fs = require("fs");
const { filePathFilter } = require("@jsdevtools/file-path-filter");
const nodeExternals = require("webpack-node-externals");
const CopyPlugin = require("copy-webpack-plugin");
const WebpackShellPluginNext = require("webpack-shell-plugin-next");
const NodemonPlugin = require("nodemon-webpack-plugin");

function readFile(pathFile) {
    return new Promise((resolve, reject) => {
        fs.readFile(pathFile, "utf8", (err, fileContains) => {
            if (err) reject(err);
            resolve(fileContains);
        });
    });
}

function readFolder(filePath) {
    try {
        return fs.readdirSync(filePath, "utf8");
    } catch (e) {
        return [];
    }
}

function resolveLink(name) {
    return readFolder(path.resolve(__dirname, "../../../../", name)).length
        ? path.resolve(__dirname, "../../../../", name)
        : path.resolve(__dirname, "../../../", "node_modules", name);
}

function writeFile(pathFile, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(pathFile, content, "utf8", (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}

async function build(params) {
    console.log("Running Build...");
    const cwd = process.cwd();
    const chalk = (await import("chalk")).default;

    const projectPackage = JSON.parse(
        await readFile(path.join(cwd, "package.json"))
    );

    const packageModules = (
        await Promise.all(
            [
                ...Object.keys(projectPackage.dependencies || {}),
                ...Object.keys(projectPackage.devDependencies || {}),
            ].map(async (item) => ({
                name: item,
                type:
                    JSON.parse(
                        await readFile(
                            path.join(cwd, "node_modules", item, "package.json")
                        )
                    ).type || "commonjs",
            }))
        )
    )
        .filter((item) => item.type !== "commonjs")
        .reduce((acc, item) => ({ ...acc, [item.name]: item.type }), {});

    const postUpdateScript = {
        scripts: [
            () =>
                new Promise(async (resolve) => {
                    const moduleImports = `var nativeESMImport = {${Object.keys(
                        packageModules
                    )
                        .map((item) => `"${item}":await import("${item}")`)
                        .join()}};`;
                    await Promise.all(
                        (
                            await readFolder(params.buildFolder)
                        )
                            .map((item) => path.join(params.buildFolder, item))
                            .filter(filePathFilter("**/{main,*.worker}.js"))
                            .map(async (filePath) => {
                                let fileContent = await readFile(filePath);
                                fileContent = `(async()=>{${moduleImports} ${fileContent}${
                                    params.buildType === "development"
                                        ? "\n"
                                        : "\n"
                                }})()`;
                                return writeFile(filePath, fileContent);
                            })
                    );
                    resolve();
                }),
        ],
        blocking: true,
    };

    if (Object.keys(packageModules).length) {
        console.log(
            chalk.yellow(
                "WARN: ESM modules support is experimental. Please, report about any problems"
            )
        );
    }
    console.log(
        chalk.yellow(
            "WARN: .rs files support is experimental. Please, report about any problems"
        )
    );
    console.log(
        chalk.yellow(
            "WARN: .worker.(js|ts) files support is experimental. Please, report about any problems"
        )
    );

    const defaultBabelConfig = {
        loader: resolveLink("babel-loader"),
        options: {
            presets: [
                resolveLink("@babel/preset-typescript"),
                resolveLink("@babel/preset-env"),
            ],
            plugins: [resolveLink("@babel/plugin-syntax-async-generators")],
        },
    };

    const webpackOptions = {
        config: {
            entry: [params.entry],
            output: {
                path: path.resolve(params.buildFolder),
                filename: (chunkData) =>
                    // eslint-disable-next-line no-nested-ternary
                    params.buildType === "development"
                        ? "[name].js"
                        : chunkData.chunk.name === "main"
                        ? "[name].js"
                        : "[id].js",
            },
            mode: params.buildType,
            target: "async-node",
            devtool: "source-map",
            node: false,
            externals: nodeExternals({
                importType: (moduleName) =>
                    packageModules[moduleName]
                        ? `nativeESMImport["${moduleName}"].default`
                        : `require("${moduleName}")`,
            }),
            resolve: {
                fallback: { util: require.resolve("util") },
                extensions: [".js", ".ts", ".mjs", ".cjs"],
            },
            module: {
                rules: [
                    {
                        test: /\.ts$/,
                        use: [
                            defaultBabelConfig,
                            { loader: resolveLink("ts-loader") },
                        ],
                        exclude: /node_modules/,
                        resolve: {
                            fullySpecified: false,
                        },
                    },
                    {
                        test: /\.worker\.(js)$/,
                        use: [
                            defaultBabelConfig,
                            {
                                loader: resolveLink("worker-loader"),
                                options: {
                                    filename: "[name].js",
                                },
                            },
                        ],
                    },
                    {
                        test: /\.worker\.(ts)$/,
                        use: [
                            defaultBabelConfig,
                            {
                                loader: "worker-loader",
                                options: {
                                    filename: "[name].js",
                                },
                            },
                            { loader: resolveLink("ts-loader") },
                        ],
                    },
                    {
                        test: /\.js|mjs|cjs$/,
                        exclude: /node_modules/,
                        resolve: {
                            fullySpecified: false,
                        },
                        use: defaultBabelConfig,
                    },
                    {
                        test: /\.rs$/,
                        exclude: /node_modules/,
                        use: [
                            defaultBabelConfig,
                            {
                                loader: resolveLink("rust-wasmpack-loader"),
                            },
                        ],
                    },
                    {
                        test: /\.json$/,
                        exclude: /node_modules/,
                        loader: "json",
                    },
                ],
            },
            plugins: [
                new CopyPlugin({
                    patterns: [
                        {
                            from: "src/assets",
                            to: "assets",
                        },
                    ],
                }),
                new WebpackShellPluginNext({
                    onAfterDone: postUpdateScript,
                    logging: false,
                }),
                new NodemonPlugin({
                    script: path.resolve(params.buildFolder, "main.js"),
                    nodeArgs: [
                        ...(params.debug ? ["--inspect"] : []),
                        "-r",
                        "source-map-support/register",
                    ],
                    watch: [
                        path.resolve(params.buildFolder),
                        path.resolve("./.env"),
                        path.resolve("./package.json"),
                        path.resolve("./package-lock.json"),
                    ],
                }),
            ],
        },
    };
    // TODO: Move to webpack-builder
    // TODO: Make fake path in loadConfig
    // console.log(webpack);
    const webpackCLI = new WebpackCLI();
    webpackCLI.webpack = webpack;

    webpackCLI.loadConfig = async (options) => {
        const config = {
            options: options.config,
            path: new WeakMap(),
        };
        config.path.set(config.options, null);
        return config;
    };

    await webpackCLI.runWebpack(webpackOptions, params.watch);
    // console.log();
}

module.exports = build;
