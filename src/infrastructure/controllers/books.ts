import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import type {
  GetBookOutputDto,
  GetBooksOutputDto,
} from "./dto/book/get-book.ts";
import {
  PostBookInputScheme,
  type PostBookOutputDto,
} from "./dto/book/post-book.ts";
import { BookIdScheme } from "./dto/book/book.ts";

const app = new Hono();

const dummyBook: GetBookOutputDto = {
  id: "a3a2445f-8735-4795-a853-485b38072c63",
  title: "test title",
  summary: "test summary",
  author: "test author",
  totalPages: 100,
};

// list
app.get("/", (c) => c.json<GetBooksOutputDto>([dummyBook]));
// create
app.post("/", zValidator("json", PostBookInputScheme), (c) =>
  c.json<PostBookOutputDto>(dummyBook, 201)
);
// getById
app.get("/:id", zValidator("param", BookIdScheme), (c) =>
  c.json<GetBookOutputDto>(dummyBook)
);
// delete
app.delete("/:id", zValidator("param", BookIdScheme), (c) =>
  c.newResponse(null, 204)
);

export default app;
