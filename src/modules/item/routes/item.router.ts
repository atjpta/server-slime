import { createEndpoint } from "colyseus";
import { itemService } from "@/modules/item/services/item.service.js";
import { Response, RouterContainer } from "@/utils/response.util.js";

const endpoint = createEndpoint.create({});
const prefix = "/items";

export const itemRoutes = {
    itemIndex: endpoint(prefix, { method: "GET" }, (ctx) =>
        RouterContainer(ctx, async () => {
            const data = await itemService.index();
            return Response.ok({ data });
        })
    ),
};
