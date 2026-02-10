import { getUsers } from "../lib/db/queries/users";
import { readConfig } from "../config";

export async function handlerUsers(cmd: string, ...args: string[]) {
    const currentUser = readConfig().currentUserName;
    const usersArray = await getUsers();
    if (!usersArray.length) throw new Error("There are no user records");
    for (const user of usersArray) {
        const userName = user.name;
        const userString = userName === currentUser ? `* ${userName} (current)` : `* ${userName}`;
        console.log(userString);
    }
}