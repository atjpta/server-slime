import { createEndpoint } from "colyseus";
import { battleLogService } from "@/modules/battle-log/services/battle-log.service.js";
import {
    BattleLogFilterSchema,
    BattleLogIdParamSchema,
} from "@/modules/battle-log/validators/battle-log.validator.js";
import { Response, RouterContainer } from "@/utils/response.util.js";
import { authPlayerMiddleware } from "@/modules/player/middlewares/auth-player.middleware.js";

const authEndpoint = createEndpoint.create({ use: [authPlayerMiddleware] });
const prefix = "/battle-logs";

export const battleLogRoutes = {
    battleLogIndex: authEndpoint(
        `${prefix}`,
        { method: "GET", query: BattleLogFilterSchema },
        (ctx) =>
            RouterContainer(ctx, async () => {
                const records = await battleLogService.getList(ctx.query);
                return Response.ok({ data: records });
            })
    ),
    battleLogShow: authEndpoint(
        `${prefix}/:id`,
        { method: "GET", params: BattleLogIdParamSchema },
        (ctx) =>
            RouterContainer(ctx, async () => {
                const record = await battleLogService.getById(ctx.params.id);
                return Response.ok({ data: record });
            })
    ),
};
