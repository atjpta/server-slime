import { EquipmentSlot, ItemRarity, ItemSource } from "@/modules/item/enums/item.enum.js";
import { z } from "zod";

export const EquipmentSlotKeySchema = z.object({
    slot: z.enum(Object.values(EquipmentSlot) as [string, ...string[]]),
});

export const EquipItemSchema = z.object({
    slot: z.enum(Object.values(EquipmentSlot) as [string, ...string[]]),
    item: z.string().min(1),
    rarity: z.enum(Object.values(ItemRarity) as [string, ...string[]]),
    source: z.enum(Object.values(ItemSource) as [string, ...string[]]),
    metadata: z.record(z.string(), z.unknown()).optional(),
});
