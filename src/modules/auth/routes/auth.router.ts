import { createEndpoint } from "colyseus";
import { authService } from "@/modules/auth/services/auth.service.js";
import { RegisterSchema, LoginSchema } from "@/modules/auth/validators/auth.validator.js";
import { authMiddleware } from "@/modules/auth/middlewares/auth.middleware.js";
import { Response, RouterContainer } from "@/utils/response.util.js";

const prefix = "/auth";

export const authRoutes = {
    register: createEndpoint(
        `${prefix}/register`,
        { method: "POST", body: RegisterSchema },
        (ctx) =>
            RouterContainer(ctx, async () => {
                const { email, password } = ctx.body;
                const user = await authService.register(email, password);
                return Response.created(ctx, { data: user });
            })
    ),

    login: createEndpoint(`${prefix}/login`, { method: "POST", body: LoginSchema }, (ctx) =>
        RouterContainer(ctx, async () => {
            const { email, password } = ctx.body;
            const result = await authService.login(email, password);
            if (!result) {
                return Response.badRequest(ctx, { message: "Incorrect email or password" });
            }
            return Response.ok({ data: result });
        })
    ),

    getProfile: createEndpoint(
        `${prefix}/userdata`,
        { method: "GET", use: [authMiddleware] },
        (ctx) =>
            RouterContainer(ctx, async () => {
                const { user } = ctx.context;
                const profile = await authService.getProfile(user._id);
                if (!profile) {
                    return Response.notFound(ctx);
                }
                return Response.ok({ data: profile });
            })
    ),
};
