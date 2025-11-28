import { eq } from "drizzle-orm";
import { Book } from "../../../../../core/book.interface.ts";
import { BookRepository } from "../../../../../core/ports/database.port.ts";
import { db } from "../client.ts";
import { bookTable } from "./book.schema.ts";

export class DrizzleOrmRepository implements BookRepository {
  async findById(id: string): Promise<Book | null> {
    const result = await db
      .select()
      .from(bookTable)
      .where(eq(bookTable.id, id));
    if (result.length === 0) {
      return null;
    }
    return result[0];
  }
}
