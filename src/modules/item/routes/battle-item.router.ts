import { createEndpoint } from "colyseus";
import { battleItemService } from "@/modules/item/services/battle-item.service.js";
import { Response, RouterContainer } from "@/utils/response.util.js";
import { authPlayerMiddleware } from "@/modules/player/middlewares/auth-player.middleware.js";

const authEndpoint = createEndpoint.create({ use: [authPlayerMiddleware] });
const itemPrefix = "/battle-items";

export const battleItemRoutes = {
    battleItemIndex: authEndpoint(`${itemPrefix}`, { method: "GET" }, (ctx) =>
        RouterContainer(ctx, async () => {
            const items = await battleItemService.index();
            return Response.ok({ data: items });
        })
    ),
};
