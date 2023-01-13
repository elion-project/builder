import chalk, { modifiers } from "chalk";

class SomeClass {}
(async () => {
    (await import("./dynamic")).default();
    await console.log("Hello World");
    console.log("SomeClass class name", SomeClass.name);
    console.log("chalk =>", chalk);
    console.log("chalk modifiers =>", modifiers);
    console.log(chalk.greenBright("Here is cool color used"));
})();
