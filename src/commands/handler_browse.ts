import { getFeedFollowsForUser } from "src/lib/db/queries/feed_follows";
import { getPostsForUser } from "src/lib/db/queries/posts";
import { type User } from "src/lib/db/queries/users";
import { getFeed } from "src/lib/db/queries/feeds";

export async function handlerBrowse(cmd: string, user: User, ...args: string[]) {
    const limitStr: any = args[0];
    let limitNum = 2;
    if ((typeof limitStr) === "string") limitNum = parseInt(limitStr);  

    const feedsFollowsArray = await getFeedFollowsForUser(user.id);

    for (const feedFollow of feedsFollowsArray) {
        const feed = await getFeed(feedFollow.feedName)
        const posts = await getPostsForUser(feed.id, limitNum);

        for (const post of posts) {
            console.log(`Title: ${post.title}`);
            // console.log(`Description: ${post.description}`);
            console.log(`Link: ${post.feedUrl}`);
            console.log(`Published Date: ${post.publishedAt}\n`);
        }
    }


}