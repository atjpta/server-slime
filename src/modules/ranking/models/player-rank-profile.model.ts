import { Player } from "@/modules/player/models/player.model.js";
import { RankLadder } from "@/modules/ranking/models/rank-ladder.model.js";
import { rankMode } from "@/modules/ranking/enums/ranking.enum.js";
import { RankTierConfig } from "@/modules/ranking/models/rank-tier-config.model.js";
import mongoose, { Document, Schema, Types } from "mongoose";

export interface PlayerRankProfile extends Document {
    player: Player | Types.ObjectId;
    rankLadder: RankLadder | Types.ObjectId;
    rankMode: rankMode;
    point: number;
    tier: RankTierConfig | Types.ObjectId;
    totalMatch: number;
    win: number;
    lose: number;
    draw: number;
    winStreak: number;
    loseStreak: number;
    highestRating: number;
    highestTier: RankTierConfig | Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const PlayerRankProfileSchema = new Schema<PlayerRankProfile>(
    {
        player: { type: Schema.Types.ObjectId, ref: "Player", required: true },
        rankLadder: { type: Schema.Types.ObjectId, ref: "RankLadder", required: true },
        rankMode: { type: String, required: true, enum: Object.values(rankMode) },
        point: { type: Number, required: true, default: 1000 },
        tier: { type: Schema.Types.ObjectId, ref: "RankTierConfig", required: true },
        totalMatch: { type: Number, default: 0 },
        win: { type: Number, default: 0 },
        lose: { type: Number, default: 0 },
        draw: { type: Number, default: 0 },
        winStreak: { type: Number, default: 0 },
        loseStreak: { type: Number, default: 0 },
        highestRating: { type: Number, default: 0 },
        highestTier: { type: Schema.Types.ObjectId, ref: "RankTierConfig", required: true },
    },
    { timestamps: true }
);

PlayerRankProfileSchema.index({ player: 1, rankLadder: 1 }, { unique: true });

export const PlayerRankProfileModel = mongoose.model<PlayerRankProfile>(
    "PlayerRankProfile",
    PlayerRankProfileSchema
);
