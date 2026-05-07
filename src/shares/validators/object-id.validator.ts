import { z } from "zod";
import { Types } from "mongoose";

export const ObjectIdSchema = z.object({
    id: z.string().refine(Types.ObjectId.isValid, "Invalid ObjectId"),
});
