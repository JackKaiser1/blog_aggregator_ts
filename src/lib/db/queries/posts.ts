import { eq, sql } from "drizzle-orm";
import { db } from "../index";
import { posts } from "../schema";

export async function createPost(title: string, url: string, feedId: string, description: string | null, publishedAt: Date, ) {
    const [result] = await db
                            .insert(posts)
                            .values( {
                                title: title,
                                feedUrl: url,
                                description: description,
                                publishedAt: publishedAt,
                                feedId: feedId,
                            } )
                            .returning()
    return result;
}

export async function getPostsForUser(feedId: string, quantity: number) {
    const result = await db
                            .select()
                            .from(posts)
                            .orderBy(sql`${posts.publishedAt} ASC`)
                            .where(eq(posts.feedId, feedId))
                            .limit(quantity);
    return result;
}

export async function getPostFromUrl(url: string) {
    const [result] = await db
                            .select()
                            .from(posts)
                            .where(eq(posts.feedUrl, url));
    return result;
}