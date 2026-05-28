import { createEndpoint } from "colyseus";
import { authPlayerMiddleware } from "@/modules/player/middlewares/auth-player.middleware.js";
import { equipmentService } from "@/modules/equipment/services/equipment.service.js";
import {
    EquipItemSchema,
    EquipmentSlotKeySchema,
} from "@/modules/equipment/validators/equipment.validator.js";
import { EquipmentSlot } from "@/modules/item/enums/item.enum.js";
import { Response, RouterContainer } from "@/utils/response.util.js";

const authPlayerEndpoint = createEndpoint.create({ use: [authPlayerMiddleware] });
const prefix = "/equipment";

export const equipmentRoutes = {
    equipmentPlayer: authPlayerEndpoint(`${prefix}/me`, { method: "GET" }, (ctx) =>
        RouterContainer(ctx, async () => {
            const { playerId } = ctx.context;
            const data = await equipmentService.getByPlayerId(playerId.toString());
            return Response.ok({ data });
        })
    ),

    equipItem: authPlayerEndpoint(
        `${prefix}/equip`,
        { method: "POST", body: EquipItemSchema },
        (ctx) =>
            RouterContainer(ctx, async () => {
                const { playerId } = ctx.context;
                const data = await equipmentService.equip(playerId.toString(), ctx.body as any);
                return Response.ok({ data });
            })
    ),

    unequipItem: authPlayerEndpoint(
        `${prefix}/:slot`,
        { method: "DELETE", params: EquipmentSlotKeySchema },
        (ctx) =>
            RouterContainer(ctx, async () => {
                const { playerId } = ctx.context;
                const data = await equipmentService.unequip(
                    playerId.toString(),
                    ctx.params.slot as EquipmentSlot
                );
                if (!data) return Response.notFound(ctx, { message: "Equipment not found" });
                return Response.ok({ data });
            })
    ),

    toggleEquipmentLock: authPlayerEndpoint(
        `${prefix}/:slot/lock`,
        { method: "PATCH", params: EquipmentSlotKeySchema },
        (ctx) =>
            RouterContainer(ctx, async () => {
                const { playerId } = ctx.context;
                const data = await equipmentService.toggleLock(
                    playerId.toString(),
                    ctx.params.slot as EquipmentSlot
                );
                if (!data) return Response.notFound(ctx, { message: "Equipment slot is empty" });
                return Response.ok({ data });
            })
    ),
};
