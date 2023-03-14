import chalk, { modifierNames } from "chalk";

class SomeClass {}
(async () => {
    (await import("../dynamic")).default();
    console.log("Hello World");
    console.log("SomeClass class name", SomeClass.name);
    console.log("chalk =>", chalk);
    console.log("chalk modifiers =>", modifierNames);
    console.log(chalk.greenBright("Here is cool color used"));
})();
