import { createRouter, createEndpoint, monitor, playground } from "colyseus";
import { authRoutes } from "@/routers/auth.router.js";

export const routes = createRouter({
    health: createEndpoint("/health", { method: "GET" }, async (_ctx) => {
        return { message: "OK" };
    }),
    ...authRoutes,
});

export function applyExpressRoutes(app: any) {
    app.use("/monitor", monitor());
    if (process.env.NODE_ENV !== "production") {
        app.use("/", playground());
    }
}
