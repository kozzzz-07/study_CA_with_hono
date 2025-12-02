import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { logger as honoLogger } from "hono/logger";
import books from "./infrastructure/api/controllers/book/books.ts";
import users from "./infrastructure/api/controllers/user/users.ts";

import {
  customLogger,
  logger,
} from "./infrastructure/adapters/pino-logger/adapter.ts";
import type { Logger } from "./core/ports/logger.port.ts";
import { drizzleOrmRepository } from "./infrastructure/adapters/orm/drizzle/book/book.repository.ts";
import { createBook } from "./core/entities/book.entity.ts";
import { jwt, verify } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import { bearerAuth } from "hono/bearer-auth";

export type AppEnv = {
  Variables: {
    logger: Logger;
  } & JwtVariables;
};

const app = new OpenAPIHono<AppEnv>();

// SEE: https://hono.dev/docs/middleware/builtin/logger
app.use(honoLogger(customLogger));

app.use("*", async (c, next) => {
  // loggerをコンテキストに注入
  c.set("logger", logger);
  await next();
});

// TODO: 認証はどっちが良いのだろうか。JWT使っている場合はペイロードをコンテキストから取得できる
// JWT認証
// https://hono.dev/docs/middleware/builtin/jwt
app.use(
  "/books/*",
  jwt({
    secret: Deno.env.get("JWT_SECRET")!,
  })
);

// bearerAuth認証
// https://hono.dev/docs/middleware/builtin/bearer-auth
// app.use(
//   "/books/*",
//   bearerAuth({
//     verifyToken: async (token, c) => {
//       const { sub } = await verify(token, Deno.env.get("JWT_SECRET")!);
//       if (sub && typeof sub === "string") {
//         return true;
//       }
//       return false;
//     },
//   })
// );

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
app.route("/users", users);

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

// https://github.com/honojs/middleware/issues/1437#issuecomment-3269067061
app.openAPIRegistry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description: "JWT Authentication",
});

app.get("/ui", swaggerUI({ url: "/doc" }));

Deno.serve(app.fetch);
