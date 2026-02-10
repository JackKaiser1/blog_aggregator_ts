import { createFeed, getFeed, type Feed } from "../lib/db/queries/feeds";
import { getUser, type User } from "../lib/db/queries/users";
import { readConfig } from "../config";
import { users } from "../lib/db/schema";
import { get } from "node:http";
import { createFeedFollow } from "../lib/db/queries/feed_follows";

export async function handlerAddFeed(cmd: string, ...args: string[]) {
    if (args.length < 2) throw new Error(`Usage: ${cmd} <feed name> <url>`);
    const [name, url] = args;

    const feedCheck = await getFeed(name);
    if (feedCheck) throw new Error("The specified feed is already in the database");

    const currentUserName = readConfig().currentUserName;
    const user = await getUser(currentUserName);

    if (!user) throw new Error(`User ${currentUserName} not found`);

    const feed = await createFeed(name, url, user.id);
    const feedFollow = await createFeedFollow(user.id, feed.id);

    printFeed(feed, user);
} 

function printFeed(feed: Feed, user: User) {
    console.log(`${user.name}`);
    console.log(`${user.id}\n`);

    const newFeed: Record<string, string | Date> = feed;

    for (const field in newFeed) {
        console.log(newFeed[field]);
    }
}