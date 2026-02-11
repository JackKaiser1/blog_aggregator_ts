import { getFeedFollowsForUser } from "../lib/db/queries/feed_follows";
import { getUser, type User } from "../lib/db/queries/users";
import { readConfig } from "../config";

export async function handlerFollowing(cmd: string, user: User, ...args: string[]) {
    const feedFollows = await getFeedFollowsForUser(user.id);
    
    if (feedFollows.length) {
        for (const feed of feedFollows) {
            console.log(feed.feedName);
        }

    } else {
        console.log(`User ${user.name} is not following any feeds`);
    }
}