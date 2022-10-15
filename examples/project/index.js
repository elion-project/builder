import chalk from "chalk";

console.log("test");
console.log(chalk.green("xf"));
(async () => {
    const wantError = true;
    await console.log("Good day for something");
})();
