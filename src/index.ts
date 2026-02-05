import { setUser, readConfig } from "./config";
import { type CommandsRegistry, registerCommand, runCommand} from "./command_registry";
import { handlerLogin } from "./handler_login";
import { handlerRegister } from "./handler_register";
import { handlerReset } from "./handler_reset";
import { handlerUsers } from "./handler_users";
import { argv } from "node:process";

async function main() {
    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerReset);
    registerCommand(registry, "users", handlerUsers);
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

    await runCommand(registry, cmd, ...args);

    process.exit(0);
}

main();