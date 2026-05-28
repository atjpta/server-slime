import { listen } from "@colyseus/tools";
import { connectMongoDB } from "@/configs/mongo.config.js";
import { createEndpoint, createRouter, defineServer, monitor, playground } from "colyseus";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport";
import { createRooms } from "@/rooms/index.room.js";
import { authRoutes } from "@/modules/auth/routes/auth.router.js";
import { playerRoutes } from "@/modules/player/routes/player.router.js";
import { battleLogRoutes } from "@/modules/battle-log/routes/battle-log.router.js";
import { rankingRoutes } from "@/modules/ranking/routes/ranking.router.js";
import { masterDataRoutes } from "@/modules/master-data/routes/master-data.router.js";
import { battleItemRoutes } from "@/modules/item/routes/battle-item.router.js";
import { itemRoutes } from "@/modules/item/routes/item.router.js";
import { inventoryRoutes } from "@/modules/inventory/routes/inventory.router.js";
import { equipmentRoutes } from "@/modules/equipment/routes/equipment.router.js";
import { walletRoutes } from "@/modules/wallet/routes/wallet.router.js";
import { currencyTransactionRoutes } from "@/modules/wallet/routes/currency-transaction.router.js";
import { env } from "@/configs/env.config.js";
// import { redisDriver } from "@/configs/redis.config.js";

connectMongoDB();

listen(
    defineServer({
        rooms: createRooms(),
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
            ...rankingRoutes,
            ...masterDataRoutes,
            ...battleItemRoutes,
            ...itemRoutes,
            ...inventoryRoutes,
            ...equipmentRoutes,
            ...walletRoutes,
            ...currencyTransactionRoutes,
        }),
        transport: new uWebSocketsTransport({}, {}),
    }),
    env.PORT
);
