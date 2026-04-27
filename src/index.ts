import { listen } from "@colyseus/tools";
import { connectMongoDB } from "@/configs/mongo.config.js";
import { defineServer } from "colyseus";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport";
import { rooms } from "@/rooms/index.js";
import { applyExpressRoutes, routes } from "@/routers/index.js";

await connectMongoDB();

listen(
    defineServer({
        rooms,
        routes,
        express: applyExpressRoutes,
        transport: new uWebSocketsTransport({}, {}),
    })
);
