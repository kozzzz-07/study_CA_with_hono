import { createRoute } from "@hono/zod-openapi";
import { PostBookInputScheme, PostBookOutputScheme } from "../dto/post-book.ts";

export const createBookRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    params: PostBookInputScheme,
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: PostBookOutputScheme,
        },
      },
      description: "Create the book",
    },
  },
});
