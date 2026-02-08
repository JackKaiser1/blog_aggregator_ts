import { db } from "..";
import { users } from "../schema";
import { eq, sql } from "drizzle-orm";

export async function createUser(name: string) {
    const [result] = await db
                            .insert(users)
                            .values({ name: name })
                            .returning();
    return result;
}

export async function getUser(name: string) {
    const [result] = await db
                            .select()
                            .from(users)
                            .where(eq(users.name, name));
    return result;
}

export async function resetUser() {
    await db.delete(users);
}

export async function getUsers() {
    const result =  await db
                            .select()
                            .from(users);
    return result;
}

export async function getUserFromId(id: string) {
    const [result] = await db
                            .select({name: users.name})
                            .from(users)
                            .where(eq(users.id, id));
    return result;
}

export type User = typeof users.$inferSelect;