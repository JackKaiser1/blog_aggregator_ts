import { createUser , getUser} from "../lib/db/queries/users";
import { setUser } from "../config";

export async function handlerRegister(cmd: string, ...args: string[]) {
    const name = args[0];
    if (!name) throw new Error("A name must be passed in with the register command");
    
    const userCheck = await getUser(name);
    if (userCheck) throw new Error("The user already exists and cannot be registered twice");   

    const user = await createUser(name);
    setUser(name);
    console.log(`User has been registered as ${user.name}`);

}