import { ItemRarity, ItemSource } from "@/modules/item/enums/item.enum.js";
import { IItem } from "@/modules/item/models/item.model.js";
import { Player } from "@/modules/player/models/player.model.js";
import mongoose, { Document, Schema } from "mongoose";

export interface InventoryItemStats {
    attack: number;
    magic: number;
    hp: number;
    defense: number;
}

export interface InventoryItemMetadata {
    rarityStats?: InventoryItemStats[];
}

export interface InventoryItem extends Document {
    item: IItem;
    quantity: number;
    orderIndex: number;
    source: ItemSource;
    locked: boolean;
    metadata: InventoryItemMetadata | Record<string, unknown>;
}

export interface Inventory extends Document {
    player: Player;
    items: InventoryItem[];
    createdAt: Date;
    updatedAt: Date;
}

const InventoryItemSchema = new Schema<InventoryItem>(
    {
        item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
        quantity: { type: Number, required: true, default: 1, min: 1 },
        orderIndex: { type: Number, required: true },
        source: { type: String, required: true, enum: Object.values(ItemSource) },
        locked: { type: Boolean, default: false },
        metadata: { type: Schema.Types.Mixed, default: {} },
    },
    { timestamps: false }
);

const InventorySchema = new Schema<Inventory>(
    {
        player: { type: Schema.Types.ObjectId, ref: "Player", required: true, unique: true },
        items: { type: [InventoryItemSchema], default: [] },
    },
    { timestamps: true }
);

export const InventoryModel = mongoose.model<Inventory>(
    "Inventory",
    InventorySchema,
    "inventories"
);
