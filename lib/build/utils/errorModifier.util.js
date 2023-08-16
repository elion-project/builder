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
                    const baseName = parts.slice(baseIndex + 1)[0];
                    const basePartIndex = parts.findIndex(
                        (item) => item.toLowerCase() === baseName.toLowerCase(),
                    );
                    if (
                        basePartIndex !== -1 &&
                        basePartIndex !== baseIndex + 1
                    ) {
                        return [
                            ...parts.slice(
                                0,
                                parts.findIndex(
                                    (item) =>
                                        item.toLowerCase() ===
                                        baseName.toLowerCase(),
                                ) + 1,
                            ),
                            ...parts.slice(baseIndex + 2),
                        ].join(path.sep);
                    }
                    return [
                        ...parts.slice(0, baseIndex - 1),
                        ...parts.slice(baseIndex + 2),
                    ].join(path.sep);
                }
                return stack;
            };

            const stackLineArg = stackLine.split(" ");
            const atIndex = stackLineArg.findIndex(
                (item) => item.toLowerCase() === "at",
            );
            if (atIndex !== -1 && !!stackLineArg[atIndex + 1]) {
                return prepareStack(stackLine);
            }
            return stackLine;
        })
        .join("\n");
