import { getFeedFromURL } from "../lib/db/queries/feeds";
import { readConfig } from "../config";
import { createFeedFollow , getFeedFollow} from "../lib/db/queries/feed_follows";
import { getUser, getUserIdFromName } from "../lib/db/queries/users";
import { ConsoleLogWriter } from "drizzle-orm";

export async function handlerFollow(cmd: string, ...args: string[]) {
    const url = args[0];
    if (!url) throw new Error(`Usage: ${cmd} <url>`);

    const currentUserName = readConfig().currentUserName;

    const currentUser = await getUser(currentUserName);
    if (!currentUser) throw new Error(`User ${currentUserName} not found`);

    const feed = await getFeedFromURL(url);
    if (!feed) throw new Error("Feed not found");

    const feedCheck = await getFeedFollow(currentUser.id, feed.id);
    if (feedCheck) throw new Error(`User ${currentUserName} is already following ${feed.name}`);

    const newFeedFollow = await createFeedFollow(currentUser.id, feed.id);

    console.log(newFeedFollow.feedName);
    console.log(newFeedFollow.userName);
}