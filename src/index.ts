import { setUser, readConfig } from "./config";
import { type CommandsRegistry, registerCommand, runCommand} from "./command_registry";
import { handlerLogin } from "./handler_login";
import { argv } from "node:process";

function main() {
    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);
    const userArgs = process.argv.slice(2);
    if (!userArgs.length) {
        console.log("No command found");
        process.exit(1);
    }

    const cmd = userArgs[0];
    const args = userArgs.slice(1);
    
    if (!registry[cmd]) {
        console.log("Invalid command");
        process.exit(1);
    }

    runCommand(registry, cmd, ...args);
    
}

main();