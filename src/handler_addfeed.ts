import { createFeed, getFeed, type Feed } from "./lib/db/queries/feeds";
import { getUser, type User } from "./lib/db/queries/users";
import { readConfig } from "./config";
import { users } from "./lib/db/schema";
import { get } from "node:http";

export async function handlerAddFeed(cmd: string, ...args: string[]) {
    if (args.length < 2) throw new Error("addfeed expects two arguments");
    const [name, url] = args;

    const feedCheck = await getFeed(name);
    if (feedCheck) throw new Error("The specified feed is already in the database");

    const config = readConfig();
    const currentUserame = config.currentUserName;
    const user = await getUser(currentUserame);

    if (!user.id) throw new Error("User does not have a name field");
    const userId = user.id;

    const feed = await createFeed(name, url, userId);
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