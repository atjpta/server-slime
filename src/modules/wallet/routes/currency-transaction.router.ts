import { createEndpoint } from "colyseus";
import { authPlayerMiddleware } from "@/modules/player/middlewares/auth-player.middleware.js";
import { currencyTransactionService } from "@/modules/wallet/services/currency-transaction.service.js";
import { GetTransactionsSchema } from "@/modules/wallet/validators/wallet.validator.js";
import { Response, RouterContainer } from "@/utils/response.util.js";
import { CurrencyCode } from "@/modules/wallet/enums/wallet.enum.js";

const authPlayerEndpoint = createEndpoint.create({ use: [authPlayerMiddleware] });
const prefix = "/currency-transactions";

export const currencyTransactionRoutes = {
    getTransactions: authPlayerEndpoint(prefix, { method: "GET", query: GetTransactionsSchema }, (ctx) =>
        RouterContainer(ctx, async () => {
            const { playerId } = ctx.context;
            const { code, limit } = ctx.query;
            const data = await currencyTransactionService.getByPlayerId(
                playerId.toString(),
                code as CurrencyCode | undefined,
                limit
            );
            return Response.ok({ data });
        })
    ),
};
