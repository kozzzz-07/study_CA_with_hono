import { z } from "@hono/zod-openapi";

export const ErrorSchema = z.object({
  error: z.string().openapi({
    example: "User not found",
  }),
});

export const SignInUserInputScheme = z.object({
  login: z.string().min(1),
  password: z.string().min(1),
});

export type SignInUserInputDto = ReturnType<typeof SignInUserInputScheme.parse>;

export const SignInUserOutputScheme = z.object({
  accessToken: z.string(),
});

export type SignInUserOutputDto = ReturnType<
  typeof SignInUserOutputScheme.parse
>;

export const SignUpUserInputScheme = z.object({
  login: z.string().min(1),
  password: z.string().min(1),
});

export type SignUpUserInputDto = ReturnType<typeof SignUpUserInputScheme.parse>;

export const SignUpUserOutputScheme = z.object({
  accessToken: z.string(),
});

export type SignUpUserOutputDto = ReturnType<
  typeof SignUpUserOutputScheme.parse
>;
