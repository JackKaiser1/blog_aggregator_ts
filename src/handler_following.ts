import { getFeedFollowsForUser } from "./lib/db/queries/feed_follows";
import { getUserIdFromName } from "./lib/db/queries/users";
import { readConfig } from "./config";

export async function handlerFollowing(cmd: string, ...args: string[]) {
    if (args.length) throw new Error("following does not expect any arguments");

    const currentUserName = readConfig().currentUserName;
    const currentUserId = (await getUserIdFromName(currentUserName)).id;

    const feedFollows = await getFeedFollowsForUser(currentUserId);
    
    for (const feed of feedFollows) {
        console.log(feed.feedName);
    }
}