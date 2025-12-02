import { UserRepository } from "../../ports/database.port.ts";
import { Logger } from "../../ports/logger.port.ts";
import {
  CreateUserInput,
  hashPassword,
  signAndEncodeUserAccessToken,
} from "../../entities/user.entity.ts";

// Usecaseが必要とする依存関係を定義
export interface SignUpUserDeps {
  repository: UserRepository;
  logger: Logger;
}

// Usecase本体の型
export type SignUpUser = (
  args: CreateUserInput,
) => Promise<{ accessToken: string } | "USER_ALREADY_EXISTS">;

export const makeSignUpUser = (deps: SignUpUserDeps): SignUpUser => {
  //

  return async (
    args: CreateUserInput,
  ): Promise<{ accessToken: string } | "USER_ALREADY_EXISTS"> => {
    deps.logger.info("[Create user usecase] Start");

    const user = await deps.repository.create({
      login: args.login,
      password: hashPassword(args.password),
    });

    if (user === "USER_ALREADY_EXISTS") {
      return user;
    }

    const accessToken = await signAndEncodeUserAccessToken(user);

    return { accessToken };
  };
};