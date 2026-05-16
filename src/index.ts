import { listen } from "@colyseus/tools";
import { connectMongoDB } from "@/configs/mongo.config.js";
import { createEndpoint, createRouter, defineServer, monitor, playground } from "colyseus";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport";
import { rooms } from "@/rooms/index.room.js";
import { authRoutes } from "@/modules/auth/routes/auth.router.js";
import { playerRoutes } from "@/modules/player/routes/player.router.js";
import { battleLogRoutes } from "@/modules/battle-log/routes/battle-log.router.js";
import { env } from "@/configs/env.config.js";
// import { redisDriver } from "@/configs/redis.config.js";

connectMongoDB();
listen(
    defineServer({
        rooms,
        // driver: redisDriver,
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
            ...battleLogRoutes,
        }),
        transport: new uWebSocketsTransport({}, {}),
    }),
    env.PORT
);
