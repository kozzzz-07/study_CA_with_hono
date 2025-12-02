import { OpenAPIHono } from "@hono/zod-openapi";
import { signinRoute, signupRoute } from "./routes/post.ts";
import { userUseCases } from "./user.dependencies.ts";

const app = new OpenAPIHono();

const { signInUser, signUpUser } = userUseCases;

app.openapi(signinRoute, async (c) => {
  const { login, password } = c.req.valid("json");

  const user = await signInUser({ login, password });

  if (user === "USER_NOT_FOUND") {
    return c.json({ error: "User not found" }, 404);
  }
  return c.json({ accessToken: user.accessToken }, 200);
});

app.openapi(signupRoute, async (c) => {
  const { login, password } = c.req.valid("json");

  const user = await signUpUser({ login, password });

  if (user === "USER_ALREADY_EXISTS") {
    return c.json({ error: "User already exists" }, 409);
  }
  return c.json({ accessToken: user.accessToken }, 201);
});

export default app;
