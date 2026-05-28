import { ItemRarity, ItemSource } from "@/modules/item/enums/item.enum.js";
import { z } from "zod";

export const InventoryItemIdSchema = z.object({
    inventoryItemId: z.string().min(1),
});

export const AddInventoryItemSchema = z.object({
    item: z.string().min(1),
    quantity: z.number().int().positive().default(1),
    orderIndex: z.number().int().min(0),
    rarity: z.enum(Object.values(ItemRarity) as [string, ...string[]]),
    source: z.enum(Object.values(ItemSource) as [string, ...string[]]),
    metadata: z.record(z.string(), z.unknown()).optional(),
});
