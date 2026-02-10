import { setUser } from "../config";
import { getUser } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (!args.length) throw new Error("A username was expected");
    const userName = args[0];
    const user = await getUser(userName);
    if (!user) throw new Error("This user is not in the database. Use the register commmand to register a new user");

    setUser(userName);
    console.log(`Username has been set to ${userName}`);
}

