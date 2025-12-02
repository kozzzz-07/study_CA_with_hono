import { sign, verify } from "hono/jwt";
import { createHmac } from "node:crypto";
import * as z from "zod";

export type CreateUserInput = {
  login: string;
  password: string;
};

export type FindUserInput = {
  login: string;
  password: string;
};

const ConfigSchema = z.object({
  secret: z.string().min(1),
  salt: z.string().min(1),
});

type UserConfig = z.infer<typeof ConfigSchema>;

const getUserConfig = (): UserConfig => {
  return ConfigSchema.parse({
    secret: Deno.env.get("JWT_SECRET"),
    salt: Deno.env.get("USER_SALT"),
  });
};

// 本来なら認証サービスを使うべきだが、お勉強用にローカルでそれっぽいのを実装

export type ExistingUser = {
  id: string;
};

export const signAndEncodeUserAccessToken = async (user: ExistingUser): Promise<string> => {
  const config = getUserConfig();
  const accessToken = await sign(
    {
      sub: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
    },
    config.secret,
  );
  return accessToken;
};

export const hashPassword = (notHashedPassword: string): string => {
  const config = getUserConfig();
  const hmac = createHmac("sha512", config.salt);
  hmac.update(notHashedPassword);
  return hmac.digest("hex");
};

export const verifyAndDecodeUserAccessToken = async (
  accessToken: string,
): Promise<{ id: string }> => {
  const config = getUserConfig();
  const { sub } = await verify(accessToken, config.secret);

  if (sub && typeof sub === "string") {
    return { id: sub };
  }

  throw new Error("Expect a 'sub' property in jwt token payload");
};