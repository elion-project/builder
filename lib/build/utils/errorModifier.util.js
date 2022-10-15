const path = require("path");

const defaultStackTrace = Error.prepareStackTrace;
Error.prepareStackTrace = (...params) =>
    defaultStackTrace(...params)
        .split("\n")
        .map((stackLine) => {
            const content = stackLine.split("(");
            if (content.length > 1) {
                const splitLine = content[1].split("webpack:")[1];
                if (splitLine) {
                    return `${content[0]}(${path.join(
                        __dirname,
                        "../",
                        ...splitLine
                            .split(path.sep)
                            .filter((part) => !!part)
                            .slice(1)
                    )}`;
                }
            }
            return stackLine;
        })
        .join("\n");
