import { getFeeds } from "./lib/db/queries/feeds";
import { getUserFromId } from "./lib/db/queries/users";

export async function handlerFeeds(cmd: string, ...args: string[]) {
    if (args.length) throw new Error("feeds does not take any arguments");

    const feedsArray = await getFeeds();

    for (const feed of feedsArray) {
        const user = await getUserFromId(feed.userId);
        const userName = user.name;
        
        console.log(feed.name);
        console.log(feed.url);
        console.log(userName);
    }

}

