import { createRoute } from "@hono/zod-openapi";
import { BookIdScheme } from "../dto/book.ts";

export const deleteRoute = createRoute({
  method: "delete",
  path: "/:id",
  request: {
    params: BookIdScheme,
  },
  responses: {
    204: {
      description: "Delete the book",
    },
  },
  security: [{ bearerAuth: [] }],
});
