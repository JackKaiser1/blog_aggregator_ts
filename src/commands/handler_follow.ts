import { getFeedFromURL } from "../lib/db/queries/feeds";
import { readConfig } from "../config";
import { createFeedFollow } from "../lib/db/queries/feed_follows";
import { getUserIdFromName } from "../lib/db/queries/users";
import { ConsoleLogWriter } from "drizzle-orm";

export async function handlerFollow(cmd: string, ...args: string[]) {
    if (!args.length) throw new Error("follow expects one argument");

    const url = args[0];
    const currentUserName = readConfig().currentUserName;

    const curretUserId = (await getUserIdFromName(currentUserName)).id;
    const feedId = (await getFeedFromURL(url)).id;

    const newFeedFollow = await createFeedFollow(curretUserId, feedId);

    console.log(newFeedFollow.feedName);
    console.log(newFeedFollow.userName);
}