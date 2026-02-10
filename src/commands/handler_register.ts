import { createUser , getUser} from "../lib/db/queries/users";
import { setUser } from "../config";

export async function handlerRegister(cmd: string, ...args: string[]) {
    const name = args[0];
    if (!name) throw new Error(`Usage: ${cmd} <name>`);
    
    const userCheck = await getUser(name);
    if (userCheck) throw new Error(`User ${name} is already registered`);   

    const user = await createUser(name);
    setUser(name);
    
    console.log(`User has been registered as ${user.name}`);
}