import { createEndpoint } from "colyseus";
import { authMiddleware } from "@/modules/auth/middlewares/auth.middleware.js";
import { playerService } from "@/modules/player/services/player.service.js";
import { Response, RouterContainer } from "@/utils/response.util.js";
import {
    CreatePlayerSchema,
    PlayerFilterSchema,
} from "@/modules/player/validators/player.validator.js";
import { authPlayerMiddleware } from "@/modules/player/middlewares/auth-player.middleware.js";
import { ObjectIdSchema } from "@/shares/validators/object-id.validator.js";

const authEndpoint = createEndpoint.create({ use: [authMiddleware] });
const authPlayerEndpoint = createEndpoint.create({ use: [authPlayerMiddleware] });
const prefix = "/players";

export const playerRoutes = {
    create: authEndpoint(prefix, { method: "POST", body: CreatePlayerSchema }, (ctx) =>
        RouterContainer(ctx, async () => {
            const { userId } = ctx.context;
            const { name } = ctx.body;
            const player = await playerService.create(userId, name);
            if (!player) {
                return Response.badRequest(ctx, { message: "Name is existed" });
            }
            return Response.created(ctx, { data: player });
        })
    ),

    index: authEndpoint(`${prefix}`, { method: "GET", query: PlayerFilterSchema }, (ctx) =>
        RouterContainer(ctx, async () => {
            const { userId } = ctx.context;
            const records = await playerService.getList(ctx.query, userId, [
                "_id",
                "name",
                "role",
                "status",
            ]);
            return Response.ok({ data: records });
        })
    ),

    show: authPlayerEndpoint(`${prefix}/me`, { method: "GET", params: ObjectIdSchema }, (ctx) =>
        RouterContainer(ctx, async () => {
            const player = await playerService.getById(ctx.context.playerId);
            if (!player) return Response.notFound(ctx);
            return Response.ok({ data: player });
        })
    ),

    delete: authEndpoint(`${prefix}/:id`, { method: "DELETE", params: ObjectIdSchema }, (ctx) =>
        RouterContainer(ctx, async () => {
            const { id } = ObjectIdSchema.parse(ctx.params);
            const player = await playerService.delete(id);
            if (!player) return Response.notFound(ctx);
            return Response.ok();
        })
    ),

    selectPlayer: authEndpoint(
        `${prefix}/select-player/:id`,
        { method: "POST", params: ObjectIdSchema },
        (ctx) =>
            RouterContainer(ctx, async () => {
                const { userId } = ctx.context;
                const { id } = ObjectIdSchema.parse(ctx.params);
                const result = await playerService.selectPlayer(userId, id);
                if (!result) {
                    return Response.notFound(ctx);
                }
                return Response.ok({ data: result });
            })
    ),
};
