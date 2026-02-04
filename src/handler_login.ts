import { setUser } from "./config";

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (!args.length) throw new Error("A username was expected");
    const userName = args[0];
    setUser(userName);
    console.log(`Username has been set to ${userName}`);
}

