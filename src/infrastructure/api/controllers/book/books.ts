import { OpenAPIHono } from "@hono/zod-openapi";
import { bookUseCases } from "./book.dependencies.ts";

import { getByIdRoute, listRoute } from "./routes/get.ts";
import { createBookRoute } from "./routes/post.ts";
import { deleteRoute } from "./routes/delete.ts";

const app = new OpenAPIHono();

const { getBook, listBooks, deleteBook, createBook } = bookUseCases;

// list
app.openapi(listRoute, async (c) => {
  const list = await listBooks();

  return c.json(list, 200);
});

// create
app.openapi(createBookRoute, async (c) => {
  const bookInput = c.req.valid("json");
  const createdBook = await createBook(bookInput);
  return c.json(createdBook, 201);
});

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
app.openapi(deleteRoute, async (c) => {
  const { id } = c.req.valid("param");
  await deleteBook(id);
  return c.newResponse(null, 204);
});

export default app;
