import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { fetchFeed } from "../fetch_feed";
import { createPost, getPostFromUrl } from "src/lib/db/queries/posts";

export async function handlerAgg(cmd: string, ...args: string[]) {
    const durationStr = args[0];
    if (!durationStr) throw new Error(`Usage: ${cmd} <interval>`);

    const intervalMs = parseDuration(durationStr);
    console.log(`Collecting feeds every ${intervalMs}ms`);

    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, intervalMs);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("\n\nShutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });

}

async function scrapeFeeds() {
    const nextFeed = await getNextFeedToFetch();
    if (!nextFeed) throw new Error("Feed not found");

    await markFeedFetched(nextFeed.id);

    const rssFeed = await fetchFeed(nextFeed.url);
    if (!rssFeed) throw new Error(`Failed to fetch ${nextFeed.name}`);

    const items = rssFeed.channel?.item;

    console.log(`---${rssFeed.channel.title}`);
    for (const item of items) {
        console.log(item.title);

        let description: string | null = null;
        if (item.description) description = item.description;

        const pubDate = new Date(item.pubDate);

        const postCheck = await getPostFromUrl(item.link);
        if (postCheck) continue;

        const post = await createPost(item.title, item.link, nextFeed.id, description, pubDate);
        // if (!post) throw new Error("Failed to fetch post")
    }
}

function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;

    const matchArray = durationStr.match(regex);
    if (!matchArray) throw new Error(`Interval format: <number><ms | s | m | h>`);

    const timeUnit = matchArray[2];
    const intervalNum = parseInt(matchArray[1]);
    let intervalMs: number;

    switch (timeUnit) {
        case "ms":
            intervalMs = intervalNum;
            break;
        case "s":
            intervalMs = intervalNum * 1_000;
            break;
        case "m": 
            intervalMs = intervalNum * 60_000;
            break;
        case "h":
            intervalMs = intervalNum * 3.6e+6;
            break;
        default:
            intervalMs = 30_000;
    }

    return intervalMs;
}

function handleError(err: unknown) {
    if (err instanceof Error) {
        console.log(err);
    } else {
        console.log(err);
    }
}


