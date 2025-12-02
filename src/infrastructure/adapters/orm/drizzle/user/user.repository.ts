import { eq, InferSelectModel } from "drizzle-orm";
import { userTable } from "./user.schema.ts";
import { UserRepository } from "../../../../../core/ports/database.port.ts";
import { db } from "../client.ts";
import { ExistingUser } from "../../../../../core/entities/user.entity.ts";

type PersistenceUser = InferSelectModel<typeof userTable>;

const create: UserRepository["create"] = async (data) => {
  const existingUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.login, data.login))
    .get();

  if (existingUser) {
    return "USER_ALREADY_EXISTS";
  }

  const createdBook = await db.insert(userTable).values(data).returning();

  return new ExistingUser({ id: createdBook[0].id });
};

const findByLoginAndPassword: UserRepository["findByLoginAndPassword"] = async (
  data
) => {
  const result: PersistenceUser[] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.login, data.login));

  if (result.length === 0) {
    return null;
  }

  return new ExistingUser({ id: result[0].id });
};

const findById: UserRepository["findById"] = async (id) => {
  const result: PersistenceUser[] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, id));

  if (result.length === 0) {
    return null;
  }

  return new ExistingUser({ id: result[0].id });
};

export const drizzleUserOrmRepository: UserRepository = {
  create,
  findByLoginAndPassword,
  findById,
};
