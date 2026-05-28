import { ItemRarity, ItemType } from "@/modules/item/enums/item.enum.js";
import { z } from "zod";

export const ItemIdSchema = z.object({
    id: z.string().min(1),
});

export const CreateItemSchema = z.object({
    code: z.string().min(1).trim(),
    type: z.enum(Object.values(ItemType) as [string, ...string[]]),
    rarity: z.enum(Object.values(ItemRarity) as [string, ...string[]]).default(ItemRarity.COMMON),
    stackable: z.boolean().default(false),
    sellPrice: z.number().min(0).default(0),
    metadata: z.record(z.string(), z.unknown()).default({}),
});

export const UpdateItemSchema = z.object({
    type: z.enum(Object.values(ItemType) as [string, ...string[]]).optional(),
    rarity: z.enum(Object.values(ItemRarity) as [string, ...string[]]).optional(),
    stackable: z.boolean().optional(),
    sellPrice: z.number().min(0).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
});
