import { Hono } from "hono";
import books from "./infrastructure/controllers/books.ts";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/books", books);

Deno.serve(app.fetch);
