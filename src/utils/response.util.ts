import { EndpointContext, EndpointOptions } from "colyseus";
import { APIError } from "@colyseus/better-call";

interface IRes {
    data: any;
    message: string;
    error: any;
    code: string | null;
}

export interface IResRaw {
    data?: any;
    message?: string;
    error?: any;
    code?: string | null;
}

export enum HttpStatusCode {
    // 2xx
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,

    // 3xx
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    NOT_MODIFIED = 304,

    // 4xx
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    CONFLICT = 409,
    GONE = 410,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,

    // 5xx
    INTERNAL_SERVER_ERROR = 500,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
}

export type Ctx = EndpointContext<string, EndpointOptions>;

export const Response = {
    ok(res: IResRaw = {}): IRes {
        return {
            data: res.data ?? null,
            message: res.message ?? "✅ Success",
            error: null,
            code: res.code ?? null,
        };
    },

    created(ctx: Ctx, res: IResRaw = {}): IRes {
        ctx.setStatus(HttpStatusCode.CREATED);
        return {
            data: res.data ?? null,
            message: res.message ?? "🎉 Created successfully",
            error: null,
            code: res.code ?? null,
        };
    },

    noContent(ctx: Ctx, res: IResRaw = {}): IRes {
        ctx.setStatus(HttpStatusCode.NO_CONTENT);
        return {
            data: null,
            message: res.message ?? "🗑️ No content",
            error: null,
            code: res.code ?? null,
        };
    },

    badRequest(ctx: Ctx, res: IResRaw = {}): IRes {
        throw ctx.error(HttpStatusCode.BAD_REQUEST, {
            data: null,
            message: res.message ?? "❌ Bad request",
            error: res.error ?? res.message,
            code: res.code ?? null,
        });
    },

    unauthorized(ctx: Ctx, res: IResRaw = {}): IRes {
        throw ctx.error(HttpStatusCode.UNAUTHORIZED, {
            data: null,
            message: res.message ?? "🔒 Unauthorized",
            error: res.error ?? res.message,
            code: res.code ?? null,
        });
    },

    forbidden(ctx: Ctx, res: IResRaw = {}): IRes {
        throw ctx.error(HttpStatusCode.FORBIDDEN, {
            data: null,
            message: res.message ?? "⛔ Forbidden",
            error: res.error ?? res.message,
            code: res.code ?? null,
        });
    },

    notFound(ctx: Ctx, res: IResRaw = {}): IRes {
        throw ctx.error(HttpStatusCode.NOT_FOUND, {
            data: null,
            message: res.message ?? "🔍 Not found",
            error: res.error ?? res.message,
            code: res.code ?? null,
        });
    },

    conflict(ctx: Ctx, res: IResRaw = {}): IRes {
        throw ctx.error(HttpStatusCode.CONFLICT, {
            data: null,
            message: res.message ?? "⚡ Conflict",
            error: res.error ?? res.message,
            code: res.code ?? null,
        });
    },

    unprocessable(ctx: Ctx, res: IResRaw = {}): IRes {
        throw ctx.error(HttpStatusCode.UNPROCESSABLE_ENTITY, {
            data: null,
            message: res.message ?? "⚠️ Unprocessable entity",
            error: res.error ?? res.message,
            code: res.code ?? null,
        });
    },

    internalError(ctx: Ctx, res: IResRaw = {}): IRes {
        throw ctx.error(HttpStatusCode.INTERNAL_SERVER_ERROR, {
            data: null,
            message: res.message ?? "💥 Internal server error",
            error: res.error ?? res.message,
            code: res.code ?? null,
        });
    },
};

export const RouterContainer = async (ctx: Ctx, fn: () => Promise<IRes>): Promise<IRes> => {
    try {
        return await fn();
    } catch (e) {
        if (e instanceof APIError) throw e;
        return Response.internalError(ctx, { error: (e as any)?.message ?? e });
    }
};
