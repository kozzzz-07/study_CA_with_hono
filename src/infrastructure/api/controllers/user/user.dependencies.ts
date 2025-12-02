// src/infrastructure/api/controllers/user/user.dependencies.ts

import { logger } from "../../../adapters/pino-logger/adapter.ts";
import { drizzleUserOrmRepository } from "../../../adapters/orm/drizzle/user/user.repository.ts";
import { makeSignUpUser } from "../../../../core/usecases/signUpUser/index.ts";
import { makeSignInUser } from "../../../../core/usecases/signInUser/index.ts";

const deps = {
  repository: drizzleUserOrmRepository,
  logger: logger,
};

// User関連のusecaseを生成
const signUpUser = makeSignUpUser(deps);
const signInUser = makeSignInUser(deps);

// このモジュールが外部（コントローラ）に提供するusecaseをエクスポート
export const userUseCases = {
  signUpUser,
  signInUser,
};
