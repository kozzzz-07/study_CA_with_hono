import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { logger as honoLogger } from "hono/logger";
import books from "./infrastructure/controllers/book/books.ts";
import {
  customLogger,
  logger,
} from "./infrastructure/adapters/pino-logger/adapter.ts";
import type { Logger } from "./core/ports/logger.port.ts";

type AppEnv = {
  Variables: {
    logger: Logger;
  };
};

const app = new OpenAPIHono<AppEnv>();

// SEE: https://hono.dev/docs/middleware/builtin/logger
app.use(honoLogger(customLogger));

app.use("*", async (c, next) => {
  // loggerをコンテキストに注入
  c.set("logger", logger);
  await next();
});

app.get("/", (c) => {
  // コンテキストから抽象化されたloggerを取得
  const logger = c.get("logger");
  logger.debug("debug");
  logger.info("Root route was called!", { path: c.req.path });
  logger.warn("warn");
  logger.error("err");

  return c.text("Hello Hono!");
});

app.route("/books", books);

// The OpenAPI documentation will be available at /doc
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});

app.get("/ui", swaggerUI({ url: "/doc" }));

Deno.serve(app.fetch);
