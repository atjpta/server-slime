import { PaginationSchema } from "@/shares/validators/pagination.validator.js";
import { z } from "zod";

export const CreatePlayerSchema = z.object({
    name: z.string().min(1).max(64),
});

export const PlayerFilterSchema = PaginationSchema.extend({});
export type PlayerFilter = z.infer<typeof PlayerFilterSchema>;
