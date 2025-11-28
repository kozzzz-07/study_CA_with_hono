import { eq, InferSelectModel } from "drizzle-orm";
import {
  Book,
  CreateBookInput,
  hydrateBook,
} from "../../../../../core/entities/book.entity.ts";
import { BookRepository } from "../../../../../core/ports/database.port.ts";
import { db } from "../client.ts";
import { bookTable } from "./book.schema.ts";

// Drizzleのスキーマから型を推論（これは永続化モデル）
type PersistenceBook = InferSelectModel<typeof bookTable>;

/**
 * 永続化モデルをドメインモデルに変換するマッパー
 */
const toDomain = (record: PersistenceBook): Book => {
  // Bookエンティティのファクトリメソッドを使ってドメインオブジェクトを再構成する
  // DBから取得したデータは信頼済みとみなし、バリデーションをスキップするメソッドを呼ぶのが一般的
  return hydrateBook({
    id: record.id,
    summary: record.summary,
    author: record.author,
    totalPages: record.totalPages,
  });
};

const create = async (book: CreateBookInput): Promise<void> => {
  await db.insert(bookTable).values(book).onConflictDoUpdate({
    target: bookTable.id,
    set: book,
  });
};

const findById = async (id: string): Promise<Book | null> => {
  const result: PersistenceBook[] = await db
    .select()
    .from(bookTable)
    .where(eq(bookTable.id, id));

  if (result.length === 0) {
    return null;
  }
  // 永続化モデルをドメインモデルにマッピングして返す
  return toDomain(result[0]);
};

const list = async (): Promise<Book[]> => {
  const result: PersistenceBook[] = await db.select().from(bookTable);
  return result.map(toDomain);
};

const remove = async (id: string): Promise<void> => {
  await db.delete(bookTable).where(eq(bookTable.id, id));
};

export const drizzleOrmRepository: BookRepository = {
  create,
  findById,
  list,
  delete: remove,
};
