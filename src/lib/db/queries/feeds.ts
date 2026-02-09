import { db } from "../index";
import { feeds } from "../schema";
import { eq } from "drizzle-orm";

export async function createFeed(name: string, url: string, userId: string) {
    const [result] = await db
                            .insert(feeds)
                            .values({ name: name, url: url, userId: userId })
                            .returning();
    return result;
}

export async function getFeed(name: string) {
    const [result] = await db
                            .select()
                            .from(feeds)
                            .where(eq(feeds.name, name));
    return result;
}

export async function getFeeds() {
    const result = await db
                            .select({ name: feeds.name, url: feeds.url, userId: feeds.userId })
                            .from(feeds);
    return result;
}

export async function getFeedFromURL(url: string) {
    const [result] = await db
                            .select()
                            .from(feeds)
                            .where(eq(feeds.url, url));
    return result; 
}


export type Feed = typeof feeds.$inferSelect;