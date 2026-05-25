import { createEndpoint } from "colyseus";
import { authMiddleware } from "@/modules/auth/middlewares/auth.middleware.js";
import { masterDataService } from "@/modules/master-data/services/master-data.service.js";
import {
    CreateMasterDataSchema,
    MasterDataKeySchema,
    UpdateMasterDataSchema,
} from "@/modules/master-data/validators/master-data.validator.js";
import { MasterDataKey } from "@/modules/master-data/enums/master-data.enum.js";
import { Response, RouterContainer } from "@/utils/response.util.js";

const endpoint = createEndpoint.create({});
const authEndpoint = createEndpoint.create({ use: [authMiddleware] });
const prefix = "/master-data";

export const masterDataRoutes = {
    getMasterData: endpoint(prefix, { method: "GET" }, (ctx) =>
        RouterContainer(ctx, async () => {
            const data = await masterDataService.getAll();
            return Response.ok({ data });
        })
    ),

    getMasterDataByKey: endpoint(
        `${prefix}/:key`,
        { method: "GET", params: MasterDataKeySchema },
        (ctx) =>
            RouterContainer(ctx, async () => {
                const data = await masterDataService.getByKey(ctx.params.key as MasterDataKey);
                if (!data) return Response.notFound(ctx, { message: "Master data not found" });
                return Response.ok({ data });
            })
    ),

    createMasterData: authEndpoint(
        prefix,
        { method: "POST", body: CreateMasterDataSchema },
        (ctx) =>
            RouterContainer(ctx, async () => {
                const { key, value, note } = ctx.body;
                const data = await masterDataService.create(key as MasterDataKey, value, note);
                return Response.created(ctx, { data });
            })
    ),

    updateMasterData: authEndpoint(
        `${prefix}/:key`,
        { method: "PUT", params: MasterDataKeySchema, body: UpdateMasterDataSchema },
        (ctx) =>
            RouterContainer(ctx, async () => {
                const data = await masterDataService.update(
                    ctx.params.key as MasterDataKey,
                    ctx.body
                );
                if (!data) return Response.notFound(ctx, { message: "Master data not found" });
                return Response.ok({ data });
            })
    ),

    deleteMasterData: authEndpoint(
        `${prefix}/:key`,
        { method: "DELETE", params: MasterDataKeySchema },
        (ctx) =>
            RouterContainer(ctx, async () => {
                const data = await masterDataService.delete(ctx.params.key as MasterDataKey);
                if (!data) return Response.notFound(ctx, { message: "Master data not found" });
                return Response.ok({ message: "Deleted successfully" });
            })
    ),
};
