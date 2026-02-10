import { getFeeds } from "../lib/db/queries/feeds";
import { getUserFromId } from "../lib/db/queries/users";

export async function handlerFeeds(cmd: string, ...args: string[]) {
    const feedsArray = await getFeeds();
    if (!feedsArray.length) throw new Error("There are no followed feeds");

    for (const feed of feedsArray) {
        const user = await getUserFromId(feed.userId);
        const userName = user.name;
    
        console.log(`--- ${userName}`);
        console.log(feed.name);
        console.log(feed.url);
    }
}

