import { EquipmentSlot, ItemSource } from "@/modules/item/enums/item.enum.js";
import { IItem } from "@/modules/item/models/item.model.js";
import { Player } from "@/modules/player/models/player.model.js";
import mongoose, { Document, Schema } from "mongoose";

export interface EquipmentSlotStats {
    attack: number;
    magic: number;
    hp: number;
    defense: number;
}

export interface EquipmentSlotMetadata {
    rarityStats?: EquipmentSlotStats[];
}

export interface EquipmentSlotData {
    item: IItem;
    source: ItemSource;
    locked: boolean;
    metadata: EquipmentSlotMetadata | Record<string, unknown>;
}

export type IEquipmentSlots = Record<EquipmentSlot, EquipmentSlotData | null>;

export interface IEquipment extends Document, IEquipmentSlots {
    player: Player;
    createdAt: Date;
    updatedAt: Date;
}

const EquipmentSlotSchema = new Schema<EquipmentSlotData>(
    {
        item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
        source: { type: String, required: true, enum: Object.values(ItemSource) },
        locked: { type: Boolean, default: false },
        metadata: { type: Schema.Types.Mixed, default: {} },
    },
    { _id: true }
);

const EquipmentSchema = new Schema<IEquipment>(
    {
        player: { type: Schema.Types.ObjectId, ref: "Player", required: true, unique: true },
        [EquipmentSlot.ATTACK]: { type: EquipmentSlotSchema, default: null, required: true },
        [EquipmentSlot.MAGIC]: { type: EquipmentSlotSchema, default: null, required: true },
        [EquipmentSlot.SHIELD]: { type: EquipmentSlotSchema, default: null, required: true },
        [EquipmentSlot.HELMET]: { type: EquipmentSlotSchema, default: null },
        [EquipmentSlot.ARMOR]: { type: EquipmentSlotSchema, default: null },
        [EquipmentSlot.BOOTS]: { type: EquipmentSlotSchema, default: null },
        [EquipmentSlot.GLOVE]: { type: EquipmentSlotSchema, default: null },
        [EquipmentSlot.RING]: { type: EquipmentSlotSchema, default: null },
        [EquipmentSlot.AMULET]: { type: EquipmentSlotSchema, default: null },
        [EquipmentSlot.EARRING]: { type: EquipmentSlotSchema, default: null },
        [EquipmentSlot.BRACELET]: { type: EquipmentSlotSchema, default: null },
    },
    { timestamps: true }
);

export const EquipmentModel = mongoose.model<IEquipment>(
    "Equipment",
    EquipmentSchema,
    "equipments"
);
