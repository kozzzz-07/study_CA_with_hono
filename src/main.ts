import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { logger as honoLogger } from "hono/logger";
import books from "./infrastructure/api/controllers/book/books.ts";
import {
  customLogger,
  logger,
} from "./infrastructure/adapters/pino-logger/adapter.ts";
import type { Logger } from "./core/ports/logger.port.ts";
import { drizzleOrmRepository } from "./infrastructure/adapters/orm/drizzle/book/book.repository.ts";
import { createBook } from "./core/entities/book.entity.ts";

export type AppEnv = {
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
  // コンテキストから抽象化されたloggerを取得できる
  const logger = c.get("logger");
  logger.debug("debug");
  logger.info("Root route was called!", { path: c.req.path });
  logger.warn("warn");
  logger.error("err");

  return c.text("Hello Hono!");
});

app.route("/books", books);

app.get("/db-test", async (c) => {
  // db連携のテスト
  const res0 = await drizzleOrmRepository.create(
    createBook({
      title: "test",
      summary: "test",
      author: "Test",
      totalPages: 10,
    })
  );
  logger.info("list", res0);

  await drizzleOrmRepository.create(
    createBook({
      title: "test2",
      summary: "test2",
      author: "Test2",
      totalPages: 100,
    })
  );

  const res = await drizzleOrmRepository.list();
  logger.info("list", res);

  const res2 = await drizzleOrmRepository.findById(res[0].id);
  logger.info("findById", res2);

  const res3 = await drizzleOrmRepository.delete(res[0].id);
  logger.info("delete", res3);

  return c.text("ok");
});

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
