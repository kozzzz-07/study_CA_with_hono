import { createRoute } from "@hono/zod-openapi";
import { BookIdScheme } from "../dto/book.ts";
import {
  ErrorScheme,
  GetBookOutputScheme,
  GetBooksOutputScheme,
} from "../dto/get-book.ts";

export const listRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: GetBooksOutputScheme,
        },
      },
      description: "Retrieve book list",
    },
  },
  security: [{ bearerAuth: [] }],
});

export const getByIdRoute = createRoute({
  method: "get",
  path: "/:id",
  request: {
    params: BookIdScheme,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: GetBookOutputScheme,
        },
      },
      description: "Retrieve the book",
    },
    404: {
      content: {
        "application/json": {
          schema: ErrorScheme,
        },
      },
      description: "Book not found",
    },
  },
  security: [{ bearerAuth: [] }],
});
