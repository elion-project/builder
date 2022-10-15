const path = require("path");
const { filePathFilter } = require("@jsdevtools/file-path-filter");
const glob = require("glob");
const nodeExternals = require("webpack-node-externals");
const CopyPlugin = require("copy-webpack-plugin");
const WebpackShellPluginNext = require("webpack-shell-plugin-next");
const NodemonPlugin = require("nodemon-webpack-plugin");
const webpack = require("webpack");
const WebpackCLI = require("webpack-cli");

const {
    readFile,
    readFolder,
    readFileSync,
    writeFileSync,
} = require("../utils/base.util");
const {
    BUILD_START,
    BUILD_INIT,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    LOG_,
    BUILD_END,
} = require("./utils/constants.util");

const cwd = process.cwd();

module.exports = async function buildComponent(
    params,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,func-names
    callback = function (eventName, ...data) {}
) {
    // create proxy-based `defaultLogger` for making callback for each log
    const defaultLogger = new Proxy(
        {},
        {
            get(target, p) {
                return (...data) => callback(LOG_(p), ...data);
            },
        }
    );

    // Read current project package
    const projectPackage = JSON.parse(
        await readFile(path.join(cwd, "package.json"))
    );

    // take all ESM modules
    const esmModules = (
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

    // Check assets folder
    const useAssetsFolder =
        readFolder(path.resolve(cwd, params.assetsFolder)).length > 0;

    // make `init` callback
    callback(BUILD_INIT, {
        useRsLoader: glob.sync("./**/Cargo.toml").length,
        useAssetsFolder,
        esmModules,
    });

    // create `defaultJsLoader`
    const defaultJsLoader = {
        loader: require.resolve("babel-loader"),
        options: {
            presets: [
                require.resolve("@babel/preset-typescript"),
                require.resolve("@babel/preset-env"),
            ],
            plugins: [require.resolve("@babel/plugin-syntax-async-generators")],
        },
    };

    // Make webpack options
    const { webpackOptions } = await Promise.resolve(
        params.plugins.reduce(
            async (acc, item) =>
                // eslint-disable-next-line global-require,import/no-dynamic-require
                require(path.resolve(cwd, `node_modules/${item}`))({
                    ...(await acc),
                    self: path.resolve(cwd, `node_modules/${item}`),
                    defaultJsLoader: Object.seal(defaultJsLoader),
                    cwd,
                    config: params.pluginsConfig[item] || {},
                }),
            Promise.resolve({
                webpackOptions: {
                    config: {
                        entry: [
                            require.resolve("source-map-support/register"),
                            path.resolve(
                                __dirname,
                                "utils/errorModifier.util.js"
                            ),
                            params.entry,
                        ],
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
                                esmModules[moduleName]
                                    ? `nativeESMImport["${moduleName}"].default`
                                    : `require("${moduleName}")`,
                        }),
                        resolve: {
                            extensions: [".js", ".ts", ".mjs", ".cjs"],
                        },
                        module: {
                            rules: [
                                {
                                    test: /\.js|mjs|cjs$/,
                                    exclude: /node_modules/,
                                    resolve: {
                                        fullySpecified: false,
                                    },
                                    use: [defaultJsLoader],
                                },
                                {
                                    test: /\.ts$/,
                                    use: [
                                        defaultJsLoader,
                                        {
                                            loader: require.resolve(
                                                "ts-loader"
                                            ),
                                        },
                                    ],
                                    exclude: /node_modules/,
                                    resolve: {
                                        fullySpecified: false,
                                    },
                                },
                                {
                                    test: /\.json$/,
                                    exclude: /node_modules/,
                                    loader: "json",
                                },
                            ],
                        },
                        plugins: [
                            ...(useAssetsFolder
                                ? [
                                      new CopyPlugin({
                                          patterns: [
                                              {
                                                  from: "src/assets",
                                                  to: "assets",
                                              },
                                          ],
                                      }),
                                  ]
                                : []),
                            new WebpackShellPluginNext({
                                onBuildStart: {
                                    scripts: [
                                        () =>
                                            // send BUILD_START callback
                                            callback(BUILD_START),
                                    ],
                                    blocking: true,
                                },
                                onAfterDone: {
                                    scripts: [
                                        () => {
                                            const moduleImports = `var nativeESMImport = {${Object.keys(
                                                esmModules
                                            )
                                                .map(
                                                    (item) =>
                                                        `"${item}":await import("${item}")`
                                                )
                                                .join()}};`;
                                            readFolder(params.buildFolder)
                                                .map((item) =>
                                                    path.join(
                                                        params.buildFolder,
                                                        item
                                                    )
                                                )
                                                .filter(
                                                    filePathFilter(
                                                        "**/{main,*.worker}.js"
                                                    )
                                                )
                                                .forEach((filePath) => {
                                                    let fileContent =
                                                        readFileSync(filePath);
                                                    fileContent = `(async()=>{${moduleImports} ${fileContent}${
                                                        params.buildType ===
                                                        "development"
                                                            ? "\n"
                                                            : "\n"
                                                    }})()`;
                                                    return writeFileSync(
                                                        filePath,
                                                        fileContent
                                                    );
                                                });
                                        },
                                    ],
                                    blocking: true,
                                },
                                logging: false,
                                blocking: true,
                            }),
                            new NodemonPlugin(
                                {
                                    quiet: true,
                                    script: path.resolve(
                                        params.buildFolder,
                                        "main.js"
                                    ),
                                    nodeArgs: [
                                        ...(params.debug ? ["--inspect"] : []),
                                    ],
                                    watch: [
                                        path.resolve(params.buildFolder),
                                        path.resolve("./.env"),
                                        path.resolve("./package.json"),
                                        path.resolve("./package-lock.json"),
                                    ],
                                },
                                {
                                    hideCompilationErrorMessage: true,
                                }
                            ),
                        ],
                    },
                },
            })
        )
    );

    // Create webpackCLI
    const webpackCLI = new WebpackCLI();

    // Set params
    webpackCLI.webpack = webpack;
    webpackCLI.logger = defaultLogger;

    // Re-create loadConfig Function
    webpackCLI.loadConfig = async (options) => {
        const config = {
            options: options.config,
            path: new WeakMap(),
        };
        config.path.set(config.options, null);
        return config;
    };

    // Re-create runWebpack function
    webpackCLI.runWebpack = async function runWebpack(options, isWatchCommand) {
        let compiler;
        const webpackCallback = (error, stats) => {
            // send BUILD_END callback
            callback(BUILD_END, error, stats);
            try {
                if (!compiler || !stats) return;

                const err = new Error();
                err.name = "CompilationError";
                if (error) throw error;

                // eslint-disable-next-line no-nested-ternary
                const statsOptions = this.isMultipleCompiler(compiler)
                    ? {
                          children: compiler.compilers.map((webpackCompiler) =>
                              webpackCompiler.options
                                  ? webpackCompiler.options.stats
                                  : undefined
                          ),
                      }
                    : compiler.options
                    ? compiler.options.stats
                    : undefined;

                if (this.isMultipleCompiler(compiler)) {
                    statsOptions.colors = statsOptions.children.some(
                        (child) => child.colors
                    );
                }

                const printedStats = stats.toString(statsOptions);

                if (stats.hasErrors()) {
                    err.message = printedStats;
                    throw err;
                } else if (printedStats) {
                    if (params.webpackStats) this.logger.raw(printedStats);
                }
            } catch (e) {
                defaultLogger.error(e.message);
                if (e.name === "CompilationError") {
                    process.exitCode = 1;
                } else {
                    process.exit(2);
                }
            }
        };
        const env =
            isWatchCommand || options.watch
                ? { WEBPACK_WATCH: true, ...options.env }
                : {
                      WEBPACK_BUNDLE: true,
                      WEBPACK_BUILD: true,
                      ...options.env,
                  };
        // eslint-disable-next-line no-param-reassign
        options.argv = { ...options, env };
        if (isWatchCommand) {
            // eslint-disable-next-line no-param-reassign
            options.watch = true;
        }
        compiler = await this.createCompiler(options, webpackCallback);
        if (!compiler) {
            return;
        }
        const isWatch = (webpackCompiler) =>
            Boolean(
                this.isMultipleCompiler(webpackCompiler)
                    ? webpackCompiler.compilers.some(
                          (childCompiler) => childCompiler.options.watch
                      )
                    : webpackCompiler.options.watch
            );
        if (isWatch(compiler) && this.needWatchStdin(compiler)) {
            process.stdin.on("end", () => {
                process.exit(0);
            });
            process.stdin.resume();
        }
    }.bind(webpackCLI);

    // Start webpack
    await webpackCLI.runWebpack(webpackOptions, params.watch);
};