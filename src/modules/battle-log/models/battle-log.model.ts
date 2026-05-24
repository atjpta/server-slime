import { Player, PlayerStats, PlayerStatsSchema } from "@/modules/player/models/player.model.js";
import { BattleItemRule } from "@/modules/item/models/battle-item.model.js";
import { ScaleValueSkillSchema, Skill } from "@/modules/skills/models/skill.model.js";
import { SkillType } from "@/modules/skills/enums/skill.enum.js";
import { BattleEndReasonEnum } from "@/rooms/battle/enums/battle.enum.js";
import { EffectBattleEnum } from "@/rooms/battle/enums/effect.enum.js";
import { rankMode } from "@/modules/ranking/enums/ranking.enum.js";
import mongoose, { Document, Schema } from "mongoose";

export interface EffectBattle {
    typeEffect: EffectBattleEnum;
    value: number;
}

export interface BattlePlayerLog {
    player: Player;
    stats: PlayerStats;
    skills: Skill[];
}

export interface ItemUsedLog {
    code: string;
    applyTurnIndex?: number;
    rule?: BattleItemRule;
}

export interface PlayerTurnLog {
    action: number;
    damageReceive: EffectBattle[];
    stats: PlayerStats;
    itemUsed?: ItemUsedLog;
}

export interface BattleLogDetail {
    wave: number;
    turn: number;
    players: Map<string, PlayerTurnLog>;
}

export interface BattleLog extends Document {
    players: BattlePlayerLog[];
    logs: BattleLogDetail[];
    winner: Player | null;
    endReason: BattleEndReasonEnum;
    rankMode?: rankMode;
    createdAt: Date;
}

const EffectBattleSchema = new Schema<EffectBattle>(
    {
        typeEffect: { type: String, required: true, enum: Object.values(EffectBattleEnum) },
        value: { type: Number, required: true },
    },
    { _id: false }
);

const ItemUsedLogSchema = new Schema<ItemUsedLog>(
    {
        code: { type: String, required: true },
        applyTurnIndex: { type: Number },
        rule: { type: Schema.Types.Mixed },
    },
    { _id: false }
);

const PlayerTurnLogSchema = new Schema<PlayerTurnLog>(
    {
        action: { type: Number, required: true },
        damageReceive: [EffectBattleSchema],
        stats: { type: PlayerStatsSchema, required: true },
        itemUsed: { type: ItemUsedLogSchema },
    },
    { _id: false }
);

const BattleLogDetailSchema = new Schema<BattleLogDetail>(
    {
        wave: { type: Number, required: true },
        turn: { type: Number, required: true },
        players: { type: Map, of: PlayerTurnLogSchema },
    },
    { _id: false }
);

// Schema riêng cho embedded, không có unique index như SkillSchema gốc
const EmbeddedSkillSchema = new Schema<Skill>(
    {
        code: { type: String, required: true, trim: true },
        type: { type: String, required: true, enum: Object.values(SkillType) },
        scale: ScaleValueSkillSchema,
    },
    { _id: false, timestamps: false }
);

const BattlePlayerLogSchema = new Schema<BattlePlayerLog>(
    {
        player: { type: Schema.Types.ObjectId, ref: "Player", required: true },
        stats: { type: PlayerStatsSchema, required: true },
        skills: [EmbeddedSkillSchema],
    },
    { _id: false }
);

const BattleLogSchema = new Schema<BattleLog>(
    {
        players: [BattlePlayerLogSchema],
        logs: [BattleLogDetailSchema],
        winner: { type: Schema.Types.ObjectId, ref: "Player", default: null },
        endReason: { type: String, required: true, enum: Object.values(BattleEndReasonEnum) },
        rankMode: { type: String, enum: Object.values(rankMode), default: null },
    },
    { timestamps: true }
);

export const BattleLogModel = mongoose.model<BattleLog>("BattleLog", BattleLogSchema, "battle_logs");
