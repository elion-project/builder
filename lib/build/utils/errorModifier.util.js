const path = require("path");

const defaultStackTrace = Error.prepareStackTrace;
Error.prepareStackTrace = (...params) =>
    defaultStackTrace(...params)
        .split("\n")
        .map((stackLine) => {
            const prepareStack = (stack) => {
                const parts = stack.split(path.sep);
                const baseIndex = parts.indexOf("webpack:");
                if (baseIndex !== -1) {
                    parts.splice(baseIndex - 1, 3);
                    return path.join(...parts);
                }
                return stack;
            };

            const stackLineArg = stackLine.split(" ");
            const items = stackLineArg[stackLineArg.length - 1].split("(");
            return [
                ...stackLineArg.slice(0, stackLineArg.length - 1),
                [
                    ...items.slice(0, items.length - 1),
                    prepareStack(items[items.length - 1]),
                ].join("("),
            ].join(" ");
        })
        .join("\n");
