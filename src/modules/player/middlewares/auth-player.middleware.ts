import { createMiddleware } from "colyseus";
import { Response } from "@/utils/response.util.js";
import { playerService } from "@/modules/player/services/player.service.js";

export const authPlayerMiddleware = createMiddleware({ requireHeaders: true }, async (ctx) => {
    const authHeader = ctx.getHeader("authorization");
    if (!authHeader?.startsWith("Bearer "))
        Response.unauthorized(ctx, { message: "🔒 Missing token" });

    try {
        const tokenData = playerService.verifyToken(authHeader!.slice(7));
        return tokenData;
    } catch {
        Response.unauthorized(ctx, { message: "🔒 Invalid or expired token" });
    }
});
