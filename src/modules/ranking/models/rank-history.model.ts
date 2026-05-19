import { Player } from "@/modules/player/models/player.model.js";
import { RankLadder } from "@/modules/ranking/models/rank-ladder.model.js";
import { rankMode } from "@/modules/ranking/enums/ranking.enum.js";
import { BattleResultEnum } from "@/rooms/battle/enums/battle.enum.js";
import mongoose, { Document, Schema, Types } from "mongoose";

export interface RankHistoryPlayer {
    player: Player | Types.ObjectId;
    oldPoint: number;
    newPoint: number;
    point: number;
    result: BattleResultEnum;
}

export interface RankHistory extends Document {
    rankLadder: RankLadder | Types.ObjectId;
    rankMode: rankMode;
    players: RankHistoryPlayer[];
    createdAt: Date;
    updatedAt: Date;
}

const RankHistoryPlayerSchema = new Schema<RankHistoryPlayer>(
    {
        player: { type: Schema.Types.ObjectId, ref: "Player", required: true },
        oldPoint: { type: Number, required: true },
        newPoint: { type: Number, required: true },
        point: { type: Number, required: true },
        result: { type: String, required: true, enum: Object.values(BattleResultEnum) },
    },
    { _id: false }
);

const RankHistorySchema = new Schema<RankHistory>(
    {
        rankLadder: { type: Schema.Types.ObjectId, ref: "RankLadder", required: true },
        rankMode: { type: String, required: true, enum: Object.values(rankMode) },
        players: [RankHistoryPlayerSchema],
    },
    { timestamps: true }
);

export const RankHistoryModel = mongoose.model<RankHistory>("RankHistory", RankHistorySchema);
