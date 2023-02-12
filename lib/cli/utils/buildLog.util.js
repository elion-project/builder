const cliSpinners = require("cli-spinners");
const buildComponent = require("../../build/index");

const tryCatch = (func) => {
    try {
        return func();
    } catch (e) {
        return e;
    }
};

module.exports = async function buildLog(params) {
    const chalk = (await import("chalk")).default;
    const ora = (await import("ora")).default;
    const spinner = ora({
        text: "Running Build",
        spinner: cliSpinners.dots,
    });
    return buildComponent(params, (eventName, ...callbackParams) => {
        const eventNameSplit = eventName.split("::");
        if (eventNameSplit[0] === "log") {
            console[console[eventNameSplit[1]] ? eventNameSplit[1] : "log"](
                ...callbackParams
            );
        }
        if (eventNameSplit[0] === "build") {
            if (eventNameSplit[1] === "init") {
                if (!callbackParams[0].useAssetsFolder) {
                    console.warn(
                        chalk.yellow(
                            `[elion-builder] warn: Assets Folder (${params.assetsFolder}) is not created or empty`
                        )
                    );
                }
                if (params.keepClassNames) {
                    // @deprecated
                    console.warn(
                        chalk.yellow(
                            "[elion-builder] warn: Terser plugin is deprecated and will be removed in the next major version. Please move to esbuild class minification"
                        )
                    );
                }
            }
            if (eventNameSplit[1] === "start") {
                spinner.start();
            }
            if (eventNameSplit[1] === "end") {
                if (callbackParams[1].hasErrors()) {
                    // here we need to clear one up line
                    tryCatch(() => process.stdout.moveCursor(0, -1));
                    tryCatch(() => process.stdout.clearScreenDown());
                    spinner.fail().clear();
                } else {
                    spinner.succeed().clear();
                }
            }
        }
    });
};
