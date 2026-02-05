import { resetUser, getUsers} from "./lib/db/queries/users";

export async function handlerReset(cmd: string, ...args: string[]) {
    await resetUser();
    const userArray = await getUsers();
    console.log(userArray);
    if (userArray.length) throw new Error("Users records unsuccessfully wiped");
    console.log("Successfully wiped user records");
}