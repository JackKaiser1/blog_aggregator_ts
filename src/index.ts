import { setUser, readConfig } from "./config";
import { type CommandsRegistry, registerCommand, runCommand} from "./command_registry";
import { handlerLogin } from "./commands/handler_login";
import { handlerRegister } from "./commands/handler_register";
import { handlerReset } from "./commands/handler_reset";
import { handlerUsers } from "./commands/handler_users";
import { handlerAgg } from "./commands/handler_agg";
import { handlerAddFeed } from "./commands/handler_addfeed";
import { handlerFeeds } from "./commands/handler_feeds";
import { argv } from "node:process";
import { feeds } from "./lib/db/schema";
import { handlerFollow } from "./commands/handler_follow";
import { handlerFollowing } from "./commands/handler_following";

async function main() {
    const userArgs = process.argv.slice(2);

    if (!userArgs.length) {
        console.log("No command found");
        process.exit(1);
    }

    const cmd = userArgs[0];
    const args = userArgs.slice(1);
    const registry: CommandsRegistry = {};

    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerReset);
    registerCommand(registry, "users", handlerUsers);
    registerCommand(registry, "agg", handlerAgg);
    registerCommand(registry, "addfeed", handlerAddFeed);
    registerCommand(registry, "feeds", handlerFeeds);
    registerCommand(registry, "follow", handlerFollow);
    registerCommand(registry, "following", handlerFollowing);
    
    try {
        await runCommand(registry, cmd, ...args);
    } catch (err) {
        if (err instanceof Error) {
            console.log(`Error running command ${cmd}: ${err.message}`);
        } else {
            console.log(`Error running comamnd ${cmd}: ${err}`);
        }
        process.exit(1);
    }
    process.exit(0);
}

main();