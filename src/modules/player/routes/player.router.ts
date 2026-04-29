import { createEndpoint } from "colyseus";
import { authMiddleware } from "@/modules/auth/middlewares/auth.middleware.js";
import { playerService } from "@/modules/player/services/player.service.js";
import {
    CreatePlayerSchema,
    PlayerIdSchema,
} from "@/modules/player/validators/player.validator.js";
import { Response, RouterContainer } from "@/utils/response.util.js";

const authEndpoint = createEndpoint.create({ use: [authMiddleware] });
const prefix = "/players";

export const playerRoutes = {
    createPlayer: authEndpoint(prefix, { method: "POST", body: CreatePlayerSchema }, (ctx) =>
        RouterContainer(ctx, async () => {
            const { user } = ctx.context;
            const { name } = ctx.body;
            const player = await playerService.create(user._id, name);
            if (!player) {
                return Response.badRequest(ctx, { message: "Name is existed" });
            }
            return Response.created(ctx, { data: player });
        })
    ),

    getPlayer: authEndpoint(`${prefix}/:id`, { method: "GET", params: PlayerIdSchema }, (ctx) =>
        RouterContainer(ctx, async () => {
            const player = await playerService.getById(ctx.params.id);
            if (!player) return Response.notFound(ctx);
            return Response.ok({ data: player });
        })
    ),

    deletePlayer: authEndpoint(
        `${prefix}/:id`,
        { method: "DELETE", params: PlayerIdSchema },
        (ctx) =>
            RouterContainer(ctx, async () => {
                const player = await playerService.delete(ctx.params.id);
                if (!player) return Response.notFound(ctx);
                return Response.ok(ctx);
            })
    ),
};
