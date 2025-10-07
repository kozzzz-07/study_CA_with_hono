// 抽象化のために実装しているが、実際は以下のような実装で十分だと思う。logger.portも冗長すぎていらない。
// export const logger = pino({
//   level: "info",
// });
// export const customLogger = (message: string, ...rest: string[]) => {
//   logger.info({}, message, ...rest);
// };

import pino from "pino";
import type { Logger } from "../../../core/ports/logger.port.ts";

const pinoInstance = pino({ level: Deno.env.get("LOG_LEVEL") || "info" });

// hono/loggerミドルウェア用のカスタムロガー
export const customLogger = (message: string, ...rest: string[]) => {
  pinoInstance.info({}, message, ...rest);
};

// Portによる抽象化
export const logger: Logger = {
  error(message: string, ...meta: unknown[]): void {
    pinoInstance.error({ meta }, message);
  },
  warn(message: string, ...meta: unknown[]): void {
    pinoInstance.warn({ meta }, message);
  },
  info(message: string, ...meta: unknown[]): void {
    pinoInstance.info({ meta }, message);
  },
  debug(message: string, ...meta: unknown[]): void {
    pinoInstance.debug({ meta }, message);
  },
};
