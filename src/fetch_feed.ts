import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
}

type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
}

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const resp = await fetch(feedURL, {
        method: "GET",
        mode: "cors",
        headers: {
            "User-Agent": "gator",
            "Accept": "application/rss+xml",
        },
    });
    if (!resp.ok) throw new Error("Failed to fetch RSS feed");

    const respText = await resp.text();

    const parser = new XMLParser();
    const feedObj = parser.parse(respText);
    if (!feedObj.rss?.channel) throw new Error("RSS XML file does not have a channel property");

    const channel = feedObj.rss?.channel;

    if (!channel.title 
        || typeof channel.title !== "string" 
        || !channel.link 
        || typeof channel.link !== "string"
        || !channel.description 
        || typeof channel.description !== "string"
        || !channel.item) {
            throw new Error("Channel object is invalid");
        }

    const {title: metaTitle, link: metaLink, description: metaDescription} = channel;

    const items: any[] = Array.isArray(channel.item) ? channel.item : [channel.item];
    const validItems: RSSItem[] = []; 

    for (const item of items) {
        if (!item.title 
            || typeof item.title !== "string"
            || !item.link 
            || typeof item.link !== "string"
            || !item.description 
            || typeof item.description !== "string"
            || !item.pubDate 
            || typeof item.pubDate !== "string" 
        ) {
            continue;
        }

        const itemObj: RSSItem = { 
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate
        };

        validItems.push(itemObj);
    }
    
    return {
        channel: {
            title: metaTitle,
            link: metaLink,
            description: metaDescription,
            item: validItems,
        },
    };
}