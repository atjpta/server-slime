import { createEndpoint } from "colyseus";
import { authPlayerMiddleware } from "@/modules/player/middlewares/auth-player.middleware.js";
import { playerRankProfileService } from "@/modules/ranking/services/player-rank-profile.service.js";
import { rankConfigService } from "@/modules/ranking/services/rank-config.service.js";
import {
    LeaderboardFilterSchema,
    RankModeSchema,
    RankProfileFilterSchema,
} from "@/modules/ranking/validators/ranking.validator.js";
import { Response, RouterContainer } from "@/utils/response.util.js";

const endpoint = createEndpoint.create({});
const authPlayerEndpoint = createEndpoint.create({ use: [authPlayerMiddleware] });
const prefix = "/ranking";

export const rankingRoutes = {
    rankConfig: endpoint(`${prefix}/config`, { method: "GET" }, (ctx) =>
        RouterContainer(ctx, async () => {
            const config = await rankConfigService.getRankConfig();
            return Response.ok({ data: config });
        })
    ),

    leaderboard: endpoint(
        `${prefix}/leaderboard`,
        { method: "GET", query: LeaderboardFilterSchema },
        (ctx) =>
            RouterContainer(ctx, async () => {
                const { rankMode, page, limit } = ctx.query;
                const data = await playerRankProfileService.getLeaderboard(rankMode, page, limit);
                return Response.ok({ data });
            })
    ),

    rankPositionMe: authPlayerEndpoint(
        `${prefix}/me/position`,
        { method: "GET", query: RankModeSchema },
        (ctx) =>
            RouterContainer(ctx, async () => {
                const { playerId } = ctx.context;
                const data = await playerRankProfileService.getPlayerRankPosition(
                    playerId,
                    ctx.query.rankMode
                );
                if (!data) return Response.notFound(ctx);
                return Response.ok({ data });
            })
    ),

    rankProfileMe: authPlayerEndpoint(
        `${prefix}/me`,
        { method: "GET", query: RankProfileFilterSchema },
        (ctx) =>
            RouterContainer(ctx, async () => {
                const { playerId } = ctx.context;
                const profiles = await playerRankProfileService.getPlayerRankProfiles(
                    playerId,
                    ctx.query.rankMode
                );
                return Response.ok({ data: profiles });
            })
    ),
};
