import { rankMode } from "@/modules/ranking/enums/ranking.enum.js";
import { PaginationSchema } from "@/shares/validators/pagination.validator.js";
import { z } from "zod";

export const RankProfileFilterSchema = z.object({
    rankMode: z.nativeEnum(rankMode).optional(),
});

export const LeaderboardFilterSchema = PaginationSchema.extend({
    rankMode: z.nativeEnum(rankMode),
});

export const RankModeSchema = z.object({
    rankMode: z.nativeEnum(rankMode),
});

export type RankModeQuery = z.infer<typeof RankModeSchema>;

export type RankProfileFilter = z.infer<typeof RankProfileFilterSchema>;
export type LeaderboardFilter = z.infer<typeof LeaderboardFilterSchema>;
