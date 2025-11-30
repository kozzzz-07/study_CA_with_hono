import { OpenAPIHono } from "@hono/zod-openapi";
import { bookUseCases } from "./book.dependencies.ts";
import type { GetBookOutputDto } from "./dto/get-book.ts";

import { getByIdRoute, listRoute } from "./routes/get.ts";
import { createBookRoute } from "./routes/post.ts";
import { deleteRoute } from "./routes/delete.ts";

const app = new OpenAPIHono();

const { getBook } = bookUseCases;

const dummyBook: GetBookOutputDto = {
  id: "a3a2445f-8735-4795-a853-485b38072c63",
  title: "test title",
  summary: "test summary",
  author: "test author",
  totalPages: 100,
};

// list
app.openapi(listRoute, (c) => c.json([dummyBook]));
// create
app.openapi(createBookRoute, (c) => c.json(dummyBook, 201));
// getById
app.openapi(getByIdRoute, async (c) => {
  const { id } = c.req.valid("param");
  const book = await getBook(id);

  if (!book) {
    return c.json({ message: "Book not found" }, 404);
  }

  return c.json(book, 200);
});

// delete
app.openapi(deleteRoute, (c) => c.newResponse(null, 204));

export default app;
