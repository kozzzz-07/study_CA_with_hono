import type { MiddlewareHandler } from "hono";
import { drizzleUserOrmRepository } from "../../adapters/orm/drizzle/user/user.repository.ts";
import type { AppEnv } from "../../../main.ts";

// トークンが有効かつユーザーが削除されているケースを塞ぐ
export const verifyUserExists = (): MiddlewareHandler<AppEnv> => {
  return async (c, next) => {
    const payload = c.get("jwtPayload");
    const logger = c.get("logger");

    if (!payload || !payload.sub) {
      logger.warn("No user ID found in JWT payload");
      // 実際はあんまり詳細を書かない方が良い
      // import { HTTPException } from "hono/http-exception"; をスローでもいいかも
      return c.json(
        { error: "Unauthorized", message: "User ID not in token payload" },
        401
      );
    }
    const userId = payload.sub;

    try {
      const user = await drizzleUserOrmRepository.findById(userId);

      if (!user) {
        logger.warn(`User with ID ${userId} from token not found in DB`);
        return c.json(
          { error: "Forbidden", message: "User not found or invalid token" },
          403
        );
      }

      // You can optionally add the user to the context if needed by your route handlers
      // c.set("user", user);
    } catch (err) {
      logger.error("Error verifying user in database", err);
      return c.json(
        { error: "Internal Server Error", message: "Error verifying user" },
        500
      );
    }

    await next();
  };
};
