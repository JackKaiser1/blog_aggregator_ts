type CommandHandler = (cmd: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = {
    [key: string]: CommandHandler;
}

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    try {
        if (registry[cmdName]) {
            const handler = registry[cmdName];
            await handler(cmdName, ...args);
        }   
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
            process.exit(1);
        } else {
            console.log("Unknown error");
        }
    }
}

