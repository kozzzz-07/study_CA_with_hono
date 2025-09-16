import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import type {
  GetBookOutputDto,
  GetBooksOutputDto,
} from "./dto/book/get-book.ts";
import {
  PostBookInputDto as PostBookInputSchema,
  type PostBookOutputDto,
} from "./dto/book/post-book.ts";

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
app.post("/", zValidator("json", PostBookInputSchema), (c) =>
  c.json<PostBookOutputDto>(dummyBook, 201)
);
// getById
app.get("/:id", (c) => c.json<GetBookOutputDto>(dummyBook));
// delete
app.delete("/:id", (c) => c.newResponse(null, 204));

export default app;
