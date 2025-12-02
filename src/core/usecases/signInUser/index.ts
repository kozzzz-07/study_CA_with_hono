import { UserRepository } from "../../ports/database.port.ts";
import { Logger } from "../../ports/logger.port.ts";
import {
  FindUserInput,
  hashPassword,
  signAndEncodeUserAccessToken,
} from "../../entities/user.entity.ts";

// Usecaseが必要とする依存関係を定義
export interface SignInUserDeps {
  repository: UserRepository;
  logger: Logger;
}

// Usecase本体の型
export type SignInUser = (
  args: FindUserInput,
) => Promise<{ accessToken: string } | "USER_NOT_FOUND">;

export const makeSignInUser = (deps: SignInUserDeps): SignInUser => {
  // 実際にHonoのハンドラから呼ばれる関数
  return async (
    args: FindUserInput,
  ): Promise<{ accessToken: string } | "USER_NOT_FOUND"> => {
    deps.logger.info("[Get user usecase] Start");

    const existingUser = await deps.repository.findByLoginAndPassword({
      login: args.login,
      password: hashPassword(args.password),
    });

    if (existingUser) {
      const accessToken = await signAndEncodeUserAccessToken(existingUser);

      return { accessToken };
    }

    return "USER_NOT_FOUND";
  };
};