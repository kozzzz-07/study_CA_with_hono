import { eq, InferSelectModel } from "drizzle-orm";
import { Book, hydrateBook } from "../../../../../core/entities/book.entity.ts";
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

/**
 * ドメインモデルを永続化モデルに変換するマッパー
 */
const toPersistence = (book: Book) => {
  return {
    id: book.id,
    summary: book.summary,
    author: book.author,
    totalPages: book.totalPages,
    // createdAt はDBが自動で設定するので、ここでは不要
  };
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

const create = async (book: Book): Promise<void> => {
  await db
    .insert(bookTable)
    .values(toPersistence(book))
    .onConflictDoUpdate({
      target: bookTable.id,
      set: toPersistence(book),
    });
};

export const drizzleOrmRepository: BookRepository = {
  findById,
  create,
};
