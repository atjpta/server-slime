import { EquipmentSlot, ItemRarity, ItemType } from "@/modules/item/enums/item.enum.js";
import mongoose, { Document, Schema } from "mongoose";

export interface ItemBaseStats {
    attack?: number;
    magic?: number;
    hp?: number;
    defense?: number;
}

export interface EquipmentMetadata {
    slot: EquipmentSlot;
    baseStats: ItemBaseStats;
}

export interface IItem extends Document {
    code: string;
    type: ItemType;
    rarity: ItemRarity;
    stackable: boolean;
    sellPrice: number;
    metadata: EquipmentMetadata | Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

const ItemSchema = new Schema<IItem>(
    {
        code: { type: String, required: true, trim: true, unique: true },
        type: { type: String, required: true, enum: Object.values(ItemType) },
        rarity: {
            type: String,
            required: true,
            enum: Object.values(ItemRarity),
            default: ItemRarity.COMMON,
        },
        stackable: { type: Boolean, required: true, default: false },
        sellPrice: { type: Number, required: true, default: 0 },
        metadata: { type: Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);

export const ItemModel = mongoose.model<IItem>("Item", ItemSchema, "items");
