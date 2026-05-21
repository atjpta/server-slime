import { rankMode } from "@/modules/ranking/enums/ranking.enum.js";
import mongoose, { Document, Schema } from "mongoose";

export interface RuleSet {
    initialPoint: number;
    winPoint: number;
    losePoint: number;
}

export enum RankLadderStatus {
    ACTIVE = "active",
    ENDED = "ended",
}

export interface RankLadder extends Document {
    rankMode: rankMode;
    name: string;
    ruleSet: RuleSet;
    status: RankLadderStatus;
    createdAt: Date;
    updatedAt: Date;
}

const RuleSetSchema = new Schema<RuleSet>(
    {
        initialPoint: { type: Number, required: true },
        winPoint: { type: Number, required: true },
        losePoint: { type: Number, required: true },
    },
    { _id: false }
);

const RankLadderSchema = new Schema<RankLadder>(
    {
        rankMode: { type: String, required: true, enum: Object.values(rankMode) },
        name: { type: String, required: true, trim: true },
        ruleSet: { type: RuleSetSchema, required: true },
        status: {
            type: String,
            enum: Object.values(RankLadderStatus),
            default: RankLadderStatus.ACTIVE,
        },
    },
    { timestamps: true }
);

export const RankLadderModel = mongoose.model<RankLadder>("RankLadder", RankLadderSchema, "rank_ladders");
