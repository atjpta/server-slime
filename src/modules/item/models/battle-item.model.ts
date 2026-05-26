import { BattleItemType } from "@/modules/item/enums/battle-item.enum.js";
import { BattlePhaseEnum } from "@/rooms/battle/enums/battle.enum.js";
import mongoose, { Document, Schema } from "mongoose";

export interface BattleItemScale {
    hp?: number;
    damage?: number;
}

export interface BattleItemRule {
    phase: BattlePhaseEnum;
    scale?: BattleItemScale;
}

export enum BattleItemStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
}

export interface BattleItem extends Document {
    code: string;
    type: BattleItemType;
    status: BattleItemStatus;
    rule: BattleItemRule;
    weight: number;
    note: string;
    createdAt: Date;
    updatedAt: Date;
}

const BattleItemSchema = new Schema<BattleItem>(
    {
        code: { type: String, required: true, trim: true, unique: true },
        type: { type: String, required: true, enum: Object.values(BattleItemType) },
        status: {
            type: String,
            enum: Object.values(BattleItemStatus),
            default: BattleItemStatus.ACTIVE,
        },
        rule: { type: Schema.Types.Mixed, default: {} },
        weight: { type: Number, required: true, default: 1 },
        note: { type: String },
    },
    { timestamps: true }
);

export const BattleItemModel = mongoose.model<BattleItem>(
    "BattleItem",
    BattleItemSchema,
    "battle_items"
);
