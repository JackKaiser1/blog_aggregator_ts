import { deleteFeedFollow } from "src/lib/db/queries/feed_follows";
import { getFeedFromURL } from "src/lib/db/queries/feeds";
import { type User } from "src/lib/db/queries/users";

export async function handlerUnfollow(cmd: string, user: User, ...args: string[]) {
    const url = args[0];
    if (!url) throw new Error(`Usage: ${cmd} <url>`);

    const feed = await getFeedFromURL(url);
    if (!feed) throw new Error("Feed not found");

    await deleteFeedFollow(user.id, feed.id);
    console.log(`User ${user.name} has unfollowed ${feed.name}`);
}