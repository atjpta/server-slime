import { rankMode } from "@/modules/ranking/enums/ranking.enum.js";
import { PaginationSchema } from "@/shares/validators/pagination.validator.js";
import { Types } from "mongoose";
import { z } from "zod";

export const BattleLogFilterSchema = PaginationSchema.extend({
    playerId: z.string().refine(Types.ObjectId.isValid, "Invalid ObjectId").optional(),
    rankMode: z.nativeEnum(rankMode).optional(),
});

export const BattleLogIdParamSchema = z.object({
    id: z.string().refine(Types.ObjectId.isValid, "Invalid ObjectId"),
});

export type BattleLogFilter = z.infer<typeof BattleLogFilterSchema>;
export type BattleLogIdParam = z.infer<typeof BattleLogIdParamSchema>;
