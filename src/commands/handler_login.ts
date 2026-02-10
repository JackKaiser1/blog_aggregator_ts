import { setUser } from "../config";
import { getUser } from "../lib/db/queries/users";

export async function handlerLogin(cmd: string, ...args: string[]) {
    const userName = args[0];
    if (!userName) throw new Error(`Usage: ${cmd} <name>`);

    const user = await getUser(userName);
    if (!user) throw new Error("This user is not in the database. Use the register commmand to register a new user");

    setUser(userName);
    console.log(`Current user has been set to ${userName}`);
}

