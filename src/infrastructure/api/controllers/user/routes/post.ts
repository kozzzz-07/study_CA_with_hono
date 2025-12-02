import { createRoute } from "@hono/zod-openapi";
import {
  ErrorSchema,
  SignInUserInputScheme,
  SignInUserOutputScheme,
  SignUpUserInputScheme,
  SignUpUserOutputScheme,
} from "../dto/post-user.ts";

export const signinRoute = createRoute({
  method: "post",
  path: "/signin",
  request: {
    body: {
      content: {
        "application/json": {
          schema: SignInUserInputScheme,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SignInUserOutputScheme,
        },
      },
      description: "Sign in user and return access token",
    },
    404: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "User not found",
    },
  },
});

export const signupRoute = createRoute({
  method: "post",
  path: "/signup",
  request: {
    body: {
      content: {
        "application/json": {
          schema: SignUpUserInputScheme,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: SignUpUserOutputScheme,
        },
      },
      description: "Sign up user and return access token",
    },
    409: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "User already exists",
    },
  },
});
