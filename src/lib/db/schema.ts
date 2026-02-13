import { integer, unique } from "drizzle-orm/gel-core";
import { pgTable, uniqueIndex, timestamp, uuid, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
                .notNull()
                .defaultNow()
                .$onUpdate(() => new Date()),
    name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
                .notNull()
                .defaultNow()
                .$onUpdate(() => new Date()),
    name: text("name").notNull().unique(),
    url: text("url").notNull().unique(),
    lastFetchedAt: timestamp("last_fetched_at")
                    .$onUpdate(() => new Date()),
    userId: uuid("user_id")
                .notNull()
                .references(() => users.id, { onDelete: "cascade" }),
});

export const feedFollows = pgTable("feed_follows", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
                .notNull()
                .defaultNow()
                .$onUpdate(() => new Date()),
    userId: uuid("user_id")
                .notNull()
                .references(() => users.id, { onDelete: "cascade" }),
    feedId: uuid("feed_id")
                .notNull()
                .references(() => feeds.id, { onDelete: "cascade" }),
},
    (t) => [
        uniqueIndex("followed_feeds").on(t.userId, t.feedId),
    ]
);

export const posts = pgTable("posts", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
                .notNull()
                .defaultNow()
                .$onUpdate(() => new Date()),
    title: text("title").notNull(),
    feedUrl: text("url").notNull().unique(),
    description: text("description"),
    publishedAt: timestamp("published_at").notNull(),
    feedId: uuid("feed_id")
                .notNull()
                .references(() => feeds.id, { onDelete: "cascade" }),
});