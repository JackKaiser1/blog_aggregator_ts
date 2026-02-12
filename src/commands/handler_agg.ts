import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { fetchFeed } from "../fetch_feed";
import { error } from "node:console";

export async function handlerAgg(cmd: string, ...args: string[]) {
    const intervalArg = args[0];
    if (!intervalArg) throw new Error(`Usage: ${cmd} <interval>`);

    const intervalReg = parseDuration(intervalArg);
    if (!intervalReg) throw new Error("Must pass number followed by quantity of time");

    let timeBetweenReqs: number;
    if (intervalReg[2] == "ms") {
        timeBetweenReqs = parseInt(intervalReg[1]);
    } else if (intervalReg[2] == "s") {
        timeBetweenReqs = parseInt(intervalReg[1]) * 1_000;
    } else if (intervalReg[2] == "m") {
        timeBetweenReqs = parseInt(intervalReg[1]) * 60_000;
    } else if (intervalReg[2] == "h") {
        timeBetweenReqs = parseInt(intervalReg[1]) * 3.6e+6;
    } else {
        throw new Error("Incorrect time format, use ms, s, m or h");
    }

    console.log(`Collecting feeds every ${timeBetweenReqs}`);

    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenReqs);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
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
    }

}

function parseDuration(durationStr: string) {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    return match;
}

function handleError(err: unknown) {
    if (err instanceof Error) {
        console.log(err.message);
    } else {
        console.log(err);
    }
}