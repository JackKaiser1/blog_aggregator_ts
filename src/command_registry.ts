import { readConfig } from "./config";
import { getUser, User } from "./lib/db/queries/users";

type CommandHandler = (cmd: string, ...args: string[]) => Promise<void>;

type UserCommandHandler = (cmd: string, user: User, ...args: string[]) => Promise<void>;

type middlewareLoggedin = (handler: UserCommandHandler) => CommandHandler;

export type CommandsRegistry = {
    [key: string]: CommandHandler;
}

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    const handler = registry[cmdName]

    if (!handler) throw new Error("Invalid command");
    
    await handler(cmdName, ...args);
}

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmd: string, ...args: string[]) => {
        const currentUserName = readConfig().currentUserName;
        if (!currentUserName) throw new Error("User not logged in");

        const user = await getUser(currentUserName);
        if (!user) throw new Error(`User ${currentUserName} not found`);

        await handler(cmd, user, ...args);
    };
}
