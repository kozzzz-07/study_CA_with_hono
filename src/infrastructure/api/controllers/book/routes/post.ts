import { createRoute } from "@hono/zod-openapi";
import { PostBookInputScheme, PostBookOutputScheme } from "../dto/post-book.ts";

export const createBookRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: PostBookInputScheme,
        },
      },
    },
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
  security: [{ bearerAuth: [] }],
});
