import { listen } from "@colyseus/tools";
import { connectMongoDB } from "@/configs/mongo.config.js";
import { createEndpoint, createRouter, defineServer, monitor, playground } from "colyseus";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport";
import { rooms } from "@/rooms/index.js";
import { authRoutes } from "@/modules/auth/routes/auth.router.js";
import { playerRoutes } from "@/modules/player/routes/player.router.js";
import { env } from "@/configs/env.config.js";

await connectMongoDB();

listen(
    defineServer({
        rooms,
        express: (app) => {
            app.use("/monitor", monitor());
            if (env.NODE_ENV !== "production") {
                app.use("/", playground());
            }
        },
        routes: createRouter({
            health: createEndpoint("/health", { method: "GET" }, async (_ctx) => {
                return { message: "OK" };
            }),
            ...authRoutes,
            ...playerRoutes,
        }),
        transport: new uWebSocketsTransport({}, {}),
    })
);
