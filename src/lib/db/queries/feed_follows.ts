import { db } from "../index";
import { feedFollows, feeds, users } from "../schema";
import { eq, and} from "drizzle-orm";

export async function createFeedFollow(userId: string, feedId: string) {
    const [newFeedFollows] = await db
                            .insert(feedFollows)
                            .values({ userId: userId, feedId: feedId})
                            .returning();

    const feedFollowsId = newFeedFollows.id;

    const [result] = await db
                            .select({
                                id: feedFollows.id,
                                createdAt: feedFollows.createdAt,
                                updatedAt: feedFollows.updatedAt,
                                userId: feedFollows.userId,
                                feedId: feedFollows.feedId,

                                feedName: feeds.name,
                                userName: users.name,
                            })
                            .from(feedFollows)
                            .innerJoin(users, eq(users.id, feedFollows.userId))
                            .innerJoin(feeds, eq(feeds.id, feedFollows.feedId))
                            .where(eq(feedFollows.id, feedFollowsId));
    return result;
}

export async function getFeedFollowsForUser(id: string) {
    const result = await db 
                            .select({
                                id: feedFollows.id,
                                createdAt: feedFollows.createdAt,
                                updatedAt: feedFollows.updatedAt,
                                userId: feedFollows.userId,
                                feedId: feedFollows.feedId,

                                feedName: feeds.name,
                                userName: users.name,
                            })
                            .from(feedFollows)
                            .innerJoin(users, eq(users.id, feedFollows.userId))
                            .innerJoin(feeds, eq(feeds.id, feedFollows.feedId))
                            .where(eq(feedFollows.userId, id));
    return result;
}

export async function getFeedFollow(userId: string, feedId: string) {
    const [result] = await db
                            .select()
                            .from(feedFollows)
                            .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)));
    return result;
}

export async function deleteFeedFollow(userId: string, feedId: string) {
    await db
            .delete(feedFollows)
            .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)));
}