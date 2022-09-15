/* eslint-disable import/no-extraneous-dependencies */
const fs = require("fs");

require.extensions[".flf"] = (module, filename) => {
    // eslint-disable-next-line no-param-reassign
    module.exports = fs.readFileSync(filename, "utf8");
};
const pack = require("../../package.json");
const font = require("../../assets/3D-ASCII.flf");

const figletImport = import("figlet");
const chalkImport = import("chalk");

function clearLastLines(count) {
    try {
        process.stdout.moveCursor(0, -count);
    } catch (e) {
        // ignore error
    }
    try {
        process.stdout.clearScreenDown();
    } catch (e) {
        // ignore error
    }
}

const getBiggestLineCount = (text) =>
    text
        .match(/[^\n]*\n/gi)
        .reduce((acc, item) => (acc > item.length ? acc : item.length), 0);

const generateSpaces = (count, spaceType = " ") => spaceType.repeat(count);

async function startScreen() {
    const chalk = (await chalkImport).default;
    const figlet = (await figletImport).default;
    async function createText(text) {
        return new Promise((resolve, reject) =>
            // eslint-disable-next-line no-promise-executor-return
            figlet.text(
                text,
                {
                    font: "3D-ASCII",
                    horizontalLayout: "full",
                    verticalLayout: "fitted",
                    whitespaceBreak: true,
                },
                (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                }
            )
        );
    }
    figlet.parseFont("3D-ASCII", font);

    const text = await createText(pack.canonicalName);
    console.log(chalk.green(text));
    clearLastLines(2);
    const version = `v${pack.version}`;
    const { description } = pack;
    const lineCount = getBiggestLineCount(text);
    const downText = `${description}${generateSpaces(
        // eslint-disable-next-line no-nested-ternary
        lineCount < 1
            ? 2
            : lineCount - (version.length + description.length + 2) < 2
            ? 2
            : lineCount - (version.length + description.length + 2)
    )} ${version}`;
    console.log(downText);
    console.log(
        `Checkout more information on ${chalk.underline(pack.homepage)}`
    );
    console.log(
        `Any bugs? Please, visit      ${chalk.underline(pack.bugs.url)}`
    );
    console.log(chalk.green(generateSpaces(downText.length, "#")));
    process.stdout.write("\n");
}

module.exports = startScreen;
