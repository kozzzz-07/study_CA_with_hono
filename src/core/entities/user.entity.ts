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

// 本来なら認証サービスを使うべきだが、お勉強用にローカルでそれっぽいのを実装
abstract class User {
  protected readonly config: UserConfig;
  constructor() {
    this.config = ConfigSchema.parse({
      secret: Deno.env.get("JWT_SECRET"),
      salt: Deno.env.get("USER_SALT"),
    });
  }
}
type ExistingUserConstructorArgs = { id: string };

export class ExistingUser extends User {
  private _id: string;

  constructor({ id }: ExistingUserConstructorArgs) {
    super();
    this._id = id;
  }

  public signAndEncodeUserAccessToken() {
    const accessToken = sign(
      {
        sub: this._id,
        exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
      },
      this.config.secret
    );

    return accessToken;
  }

  public get id() {
    return this._id;
  }
}

export class NotExistingUser extends User {
  constructor() {
    super();
  }

  public hashPassword(notHashedPassword: string) {
    const hmac = createHmac("sha512", this.config.salt);
    hmac.update(notHashedPassword);
    return hmac.digest("hex");
  }

  public async verifyAndDecodeUserAccessToken(
    accessToken: string
  ): Promise<{ id: string }> {
    const { sub } = await verify(accessToken, this.config.secret);

    if (sub && typeof sub === "string") {
      return { id: sub };
    }

    throw new Error("Expect a 'sub' property in jwt token payload");
  }
}
