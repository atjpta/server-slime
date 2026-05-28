import { createEndpoint } from "colyseus";
import { authPlayerMiddleware } from "@/modules/player/middlewares/auth-player.middleware.js";
import { walletService } from "@/modules/wallet/services/wallet.service.js";
import { AdjustBalanceDto } from "@/modules/wallet/types/wallet.type.js";
import { AdjustBalanceSchema } from "@/modules/wallet/validators/wallet.validator.js";
import { Response, RouterContainer } from "@/utils/response.util.js";

const authPlayerEndpoint = createEndpoint.create({ use: [authPlayerMiddleware] });
const prefix = "/wallet";

export const walletRoutes = {
    getWalletPlayer: authPlayerEndpoint(`${prefix}/me`, { method: "GET" }, (ctx) =>
        RouterContainer(ctx, async () => {
            const { playerId } = ctx.context;
            const data = await walletService.getByPlayerId(playerId.toString());
            return Response.ok({ data });
        })
    ),

    adjustBalance: authPlayerEndpoint(
        `${prefix}/adjust`,
        { method: "POST", body: AdjustBalanceSchema },
        (ctx) =>
            RouterContainer(ctx, async () => {
                const { playerId } = ctx.context;
                const data = await walletService.adjustBalance({
                    playerId: playerId.toString(),
                    ...ctx.body,
                } as AdjustBalanceDto);
                return Response.ok({ data });
            })
    ),

};
