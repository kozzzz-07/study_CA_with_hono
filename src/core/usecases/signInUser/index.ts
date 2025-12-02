import { UserRepository } from "../../ports/database.port.ts";
import { Logger } from "../../ports/logger.port.ts";
import { NotExistingUser } from "../../entities/user.entity.ts";

type SignInUserInput = {
  login: string;
  password: string;
};

// Usecaseが必要とする依存関係を定義
export interface SignInUserDeps {
  repository: UserRepository;
  logger: Logger;
}

// Usecase本体の型
export type SignUpUser = (
  args: SignInUserInput
) => Promise<{ accessToken: string } | "USER_NOT_FOUND">;

export const makeSignInUser = (deps: SignInUserDeps): SignUpUser => {
  // 実際にHonoのハンドラから呼ばれる関数
  return async (
    args: SignInUserInput
  ): Promise<{ accessToken: string } | "USER_NOT_FOUND"> => {
    deps.logger.info("[Get user usecase] Start");

    const notExistingUser = new NotExistingUser();

    const existingUser = await deps.repository.findByLoginAndPassword({
      login: args.login,
      password: notExistingUser.hashPassword(args.password),
    });

    if (existingUser) {
      const accessToken = await existingUser.signAndEncodeUserAccessToken();

      return { accessToken };
    }

    return "USER_NOT_FOUND";
  };
};
