const fs = require("fs");

function readFolder(filePath) {
    try {
        return fs.readdirSync(filePath, "utf8");
    } catch (e) {
        return [];
    }
}
module.exports = {
    readFile: function readFile(pathFile) {
        return new Promise((resolve, reject) => {
            fs.readFile(pathFile, "utf8", (err, fileContains) => {
                if (err) reject(err);
                resolve(fileContains);
            });
        });
    },
    readFolder,
};
