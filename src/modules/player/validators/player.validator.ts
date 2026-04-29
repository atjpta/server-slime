import { z } from "zod";

export const CreatePlayerSchema = z.object({
    name: z.string().min(1).max(64),
});

export const PlayerIdSchema = z.object({
    id: z.string().min(1),
});
