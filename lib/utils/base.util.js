const fs = require("fs");
const path = require("path");

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
    readFileSync: function readFileSync(pathFile) {
        return fs.readFileSync(pathFile, "utf8");
    },
    readFolder,
    writeFile: function writeFile(pathFile, content) {
        return new Promise((resolve, reject) => {
            fs.writeFile(pathFile, content, "utf8", (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    },
    writeFileSync: function writeFileSync(pathFile, content) {
        fs.writeFileSync(pathFile, content, "utf8");
    },
};
