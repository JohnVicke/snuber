import { authRouter } from "./auth";
import { createRoute } from "./create-router";

export const honoRouter = createRoute();

honoRouter.route("/auth", authRouter);

honoRouter.get("/", (c) => {
  return c.json({ hello: "world" });
});

honoRouter.get("/routes", (c) => {
  return c.json(
    honoRouter.routes.map((route) => ({
      method: route.method,
      path: `/api/v1${route.path}`,
    })),
  );
});
