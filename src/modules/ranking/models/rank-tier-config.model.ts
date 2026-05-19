import mongoose, { Document, Schema } from "mongoose";

export interface RankTierConfig extends Document {
    code: string;
    minPoint: number;
    createdAt: Date;
    updatedAt: Date;
}

const RankTierConfigSchema = new Schema<RankTierConfig>(
    {
        code: { type: String, required: true, trim: true, unique: true },
        minPoint: { type: Number, required: true },
    },
    { timestamps: true }
);

export const RankTierConfigModel = mongoose.model<RankTierConfig>(
    "RankTierConfig",
    RankTierConfigSchema
);
