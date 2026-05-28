import { MasterDataKey } from "@/modules/master-data/enums/master-data.enum.js";
import mongoose, { Document, Schema } from "mongoose";

export interface BattleConfigValue {
    maxWave: number;
    turnsPerWave: number;
    maxItemSlots: number;
    selectItemOfferCount: number;
    selectionTimeMs: number;
    selectionTimeOutMs: number;
    selectionItemTimeMs: number;
    selectionItemTimeOutMs: number;
    waveAnimationMs: number;
    executingDoneTimeoutMs: number;
    endedDelayMs: number;
    reconnectionS: number;
}

export interface InventoryConfigValue {
    maxStack: number;
    maxLength: number;
}

export type MasterDataValue = BattleConfigValue | InventoryConfigValue;

export interface IMasterData extends Document {
    key: MasterDataKey;
    value: MasterDataValue;
    note: string;
    createdAt: Date;
    updatedAt: Date;
}

const MasterDataSchema = new Schema<IMasterData>(
    {
        key: { type: String, required: true, unique: true, enum: Object.values(MasterDataKey) },
        value: { type: Schema.Types.Mixed, required: true, default: {} },
        note: { type: String, default: "" },
    },
    { timestamps: true }
);

export const MasterDataModel = mongoose.model<IMasterData>(
    "MasterData",
    MasterDataSchema,
    "master_data"
);
