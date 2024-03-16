import { createApp } from "./app/create-app";
import { SnuberEnv } from "./env";
import { init } from "./pkg/middleware/init";
import { registerGithubCallback, registerGithubLogin } from "./routes/github";
import { registerLiveness } from "./routes/liveness";
import { registerUser } from "./routes/user";

const app = createApp();

app.use("*", init());

registerLiveness(app);
registerUser(app);
registerGithubLogin(app);
registerGithubCallback(app);

const handler: ExportedHandler<SnuberEnv> = {
  fetch: (req: Request, env: SnuberEnv, ctx: ExecutionContext) => {
    const parsed = SnuberEnv.safeParse(env);

    if (!parsed.success) {
      return Response.json(
        {
          code: "INVALID_ENV",
          message: "Invalid environment variables",
          errors: parsed.error,
        },
        { status: 500 },
      );
    }

    return app.fetch(req, env, ctx);
  },
};

export default handler;

export type AppType = typeof app;
