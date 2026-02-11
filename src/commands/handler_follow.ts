import { getFeedFromURL } from "../lib/db/queries/feeds";
import { readConfig } from "../config";
import { createFeedFollow , getFeedFollow} from "../lib/db/queries/feed_follows";
import { getUser, getUserIdFromName, type User } from "../lib/db/queries/users";
import { ConsoleLogWriter } from "drizzle-orm";

export async function handlerFollow(cmd: string, user: User, ...args: string[]) {
    const url = args[0];
    if (!url) throw new Error(`Usage: ${cmd} <url>`);

    const feed = await getFeedFromURL(url);
    if (!feed) throw new Error("Feed not found");

    const feedCheck = await getFeedFollow(user.id, feed.id);
    if (feedCheck) throw new Error(`User ${user.name} is already following ${feed.name}`);

    const newFeedFollow = await createFeedFollow(user.id, feed.id);

    console.log(newFeedFollow.feedName);
    console.log(newFeedFollow.userName);
}