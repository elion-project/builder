module.exports = class EsmPlugin {
    constructor(esmModules) {
        this._name = "ESMPlugin";
        this._esmModules = esmModules;
    }

    static makeESMImport(moduleName) {
        return `({...nativeESMImport["${moduleName}"], __esModule:true})`;
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
                        .filter((name) => name.match(/^.*\.js$/gi))
                        .forEach((key) => {
                            const item = compilationAssets[key]._children;
                            item.unshift(
                                `(async()=>{var nativeESMImport = {${this._esmModules
                                    .map(
                                        (name) =>
                                            `"${name}":await import("${name}")`
                                    )
                                    .join()}};`
                            );
                            const lastItem = item.splice(item.length - 1, 1);
                            item.push("\n})()", ...lastItem);
                        });
                    callback();
                }
            );
        });
    }
};