import { Hono } from "hono";

const app = new Hono();

// list
app.get("/", (c) => c.json([]));
// create
app.post("/", (c) => c.json("create a book", 201));
// getById
app.get("/:id", (c) => c.json(`get ${c.req.param("id")}`));
// delete
app.delete("/:id", (c) => c.json(`delete ${c.req.param("id")}`));

export default app;
