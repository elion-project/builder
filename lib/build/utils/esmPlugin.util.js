const { sources } = require("webpack");

module.exports = class EsmPlugin {
    constructor(esmModules, variables = {}) {
        this._name = "ESMPlugin";
        this._esmModules = esmModules;
        this._variables = variables;
    }

    static makeESMImport(moduleName) {
        return `({...nativeESMImport["${moduleName}"], __esModule:true})`;
    }

    static makeCjsImport(moduleName) {
        return `require("${moduleName}")`;
    }

    apply(compiler) {
        compiler.hooks.thisCompilation.tap(this._name, (compilation) => {
            compilation.hooks.processAssets.tapAsync(
                {
                    name: this._name,
                    stage: compiler.webpack.Compilation
                        .PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
                },
                (compilationAssets, callback) => {
                    Object.keys(compilationAssets)
                        .filter(
                            (name) =>
                                name.match(/^.*\.js$/gi) &&
                                compilationAssets[name]._children &&
                                compilationAssets[name]._children.filter(
                                    (data) =>
                                        !!(
                                            typeof data === "string"
                                                ? data
                                                : data.source()
                                        ).match(/exports\.ids? ?= ?/gim)
                                ).length === 0
                        )
                        .forEach((key) => {
                            const item = compilationAssets[key]._children;
                            item.unshift(
                                new sources.RawSource(
                                    `(async()=>{var nativeESMImport = {${this._esmModules
                                        .map(
                                            (name) =>
                                                `"${name}":await import("${name}")`
                                        )
                                        .join()}};${Object.entries(
                                        this._variables
                                    )
                                        .map(([name, data]) => {
                                            const baseString = `var ${name} = `;
                                            if (typeof data === "string") {
                                                return `${baseString}"${data}"`;
                                            }
                                            if (typeof data === "number") {
                                                return `${baseString}${data}`;
                                            }
                                            if (typeof data === "boolean") {
                                                return `${baseString}${data}`;
                                            }
                                            if (data === null) {
                                                return `${baseString}null`;
                                            }
                                            if (data === undefined) {
                                                return `${baseString}undefined`;
                                            }
                                            if (typeof data === "function") {
                                                throw new Error(
                                                    "Functions are not supported as variables"
                                                );
                                            }
                                            return `${baseString}${JSON.stringify(
                                                data
                                            )};`;
                                        })
                                        .join(";")};`
                                )
                            );
                            const lastItem = item.splice(item.length - 1, 1);
                            item.push(
                                new sources.RawSource("\n})()"),
                                ...lastItem
                            );
                        });
                    callback();
                }
            );
        });
    }
};
