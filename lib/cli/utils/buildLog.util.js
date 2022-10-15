const cliSpinners = require("cli-spinners");
const buildComponent = require("../../build/index");

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
            console.log("want log", eventNameSplit[1]);
            console[console[eventNameSplit[1]] ? eventNameSplit[1] : "log"](
                ...callbackParams
            );
        }
        if (eventNameSplit[0] === "build") {
            if (eventNameSplit[1] === "init") {
                if (callbackParams[0].useRsLoader) {
                    console.log(
                        chalk.yellow(
                            "[elion-builder] warn: .rs files support is experimental. Please, report about any problems"
                        )
                    );
                }
                if (!callbackParams[0].useAssetsFolder) {
                    console.warn(
                        chalk.yellow(
                            `[elion-builder] warn: Assets Folder (${params.assetsFolder}) is not created or empty`
                        )
                    );
                }
                if (Object.keys(callbackParams[0].esmModules).length) {
                    console.log(
                        chalk.yellow(
                            "[elion-builder] warn: ESM modules support is experimental. Please, report about any problems"
                        )
                    );
                }
            }
            if (eventNameSplit[1] === "start") {
                spinner.start();
            }
            if (eventNameSplit[1] === "end") {
                spinner.succeed().clear();
            }
        }
    });
};
