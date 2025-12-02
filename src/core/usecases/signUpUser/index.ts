import { UserRepository } from "../../ports/database.port.ts";
import { Logger } from "../../ports/logger.port.ts";
import { NotExistingUser } from "../../entities/user.entity.ts";

type SignUpUserInput = {
  login: string;
  password: string;
};

// Usecaseが必要とする依存関係を定義
export interface SignUpUserDeps {
  repository: UserRepository;
  logger: Logger;
}

// Usecase本体の型
export type SignUpUser = (
  args: SignUpUserInput
) => Promise<{ accessToken: string } | "USER_ALREADY_EXISTS">;

export const makeSignUpUser = (deps: SignUpUserDeps): SignUpUser => {
  //

  return async (
    args: SignUpUserInput
  ): Promise<{ accessToken: string } | "USER_ALREADY_EXISTS"> => {
    deps.logger.info("[Create user usecase] Start");

    const notExistingUser = new NotExistingUser();

    const existingUser = await deps.repository.create({
      login: args.login,
      password: notExistingUser.hashPassword(args.password),
    });

    if (existingUser === "USER_ALREADY_EXISTS") {
      return existingUser;
    }

    const accessToken = await existingUser.signAndEncodeUserAccessToken();

    return { accessToken };
  };
};
