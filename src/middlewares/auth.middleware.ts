import { createMiddleware } from "colyseus";
import { Response } from "@/utils/response.util.js";
import { authService } from "@/services/auth.service.js";

export const authMiddleware = createMiddleware({ requireHeaders: true }, async (ctx) => {
    const authHeader = ctx.getHeader("authorization");
    if (!authHeader?.startsWith("Bearer "))
        Response.unauthorized(ctx, { message: "🔒 Missing token" });

    try {
        const user = authService.verifyToken(authHeader!.slice(7));
        return user;
    } catch {
        Response.unauthorized(ctx, { message: "🔒 Invalid or expired token" });
    }
});
