import { getFeedFollowsForUser } from "../lib/db/queries/feed_follows";
import { getUser } from "../lib/db/queries/users";
import { readConfig } from "../config";

export async function handlerFollowing(cmd: string, ...args: string[]) {
    const currentUserName = readConfig().currentUserName;
    const currentUser = await getUser(currentUserName);

    if (!currentUser) throw new Error(`User ${currentUserName} not found`);

    const feedFollows = await getFeedFollowsForUser(currentUser.id);
    
    for (const feed of feedFollows) {
        console.log(feed.feedName);
    }
}