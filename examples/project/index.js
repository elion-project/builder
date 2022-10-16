import chalk, { modifiers } from "chalk";

(async () => {
    await console.log("Hello World");
    console.log("chalk =>", chalk);
    console.log("chalk modifiers =>", modifiers);
    console.log(chalk.greenBright("Here is cool color used"));
})();
