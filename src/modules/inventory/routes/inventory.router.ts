import { createEndpoint } from "colyseus";
import { authPlayerMiddleware } from "@/modules/player/middlewares/auth-player.middleware.js";
import { inventoryService } from "@/modules/inventory/services/inventory.service.js";
import {
    AddInventoryItemSchema,
    InventoryItemIdSchema,
} from "@/modules/inventory/validators/inventory.validator.js";
import { Response, RouterContainer } from "@/utils/response.util.js";

const authPlayerEndpoint = createEndpoint.create({ use: [authPlayerMiddleware] });
const prefix = "/inventory";

export const inventoryRoutes = {
    getInventoryPlayer: authPlayerEndpoint(`${prefix}/me`, { method: "GET" }, (ctx) =>
        RouterContainer(ctx, async () => {
            const { playerId } = ctx.context;
            const data = await inventoryService.getByPlayerId(playerId.toString());
            return Response.ok({ data });
        })
    ),

    toggleInventoryItemLock: authPlayerEndpoint(
        `${prefix}/items/:id/lock`,
        { method: "PATCH", params: InventoryItemIdSchema },
        (ctx) =>
            RouterContainer(ctx, async () => {
                const { playerId } = ctx.context;
                const data = await inventoryService.toggleLock(playerId.toString(), ctx.params.id);
                if (!data) return Response.notFound(ctx, { message: "Inventory item not found" });
                return Response.ok({ data });
            })
    ),
};
