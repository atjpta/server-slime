import { PlayerRole, PlayerStatus } from "@/modules/player/enums/player.enum.js";
import { ISkill, SkillSchema } from "@/modules/skills/models/skill.model.js";
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPlayerStats {
    hp: number;
    attack: number;
    magic: number;
    defense: number;
}

export interface IPlayer extends Document {
    userId: Types.ObjectId;
    name: string;
    role: PlayerRole;
    status: PlayerStatus;
    stats: IPlayerStats;
    statsDetail: IStatsDetail;
    skillIds: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IStatsDetailBase {
    base: number;
}

export interface IStatsDetail {
    hp: IStatsDetailBase;
    attack: IStatsDetailBase;
    magic: IStatsDetailBase;
    defense: IStatsDetailBase;
}

export const HpDetailSchema = new Schema<IStatsDetailBase>(
    {
        base: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);
export const AttackDetailSchema = new Schema<IStatsDetailBase>(
    {
        base: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);
export const MagicDetailSchema = new Schema<IStatsDetailBase>(
    {
        base: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

export const DefenseDetailSchema = new Schema<IStatsDetailBase>(
    {
        base: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

const StatsDetailSchema = new Schema<IStatsDetail>(
    {
        hp: {
            type: HpDetailSchema,
            required: true,
        },
        attack: {
            type: AttackDetailSchema,
            required: true,
        },
        magic: {
            type: MagicDetailSchema,
            required: true,
        },
        defense: {
            type: DefenseDetailSchema,
            required: true,
        },
    },
    { _id: false }
);

const PlayerStatsSchema = new Schema<IPlayerStats>(
    {
        hp: { type: Number, required: true },
        attack: { type: Number, required: true },
        magic: { type: Number, required: true },
        defense: { type: Number, required: true },
    },
    { _id: false }
);

const PlayerSchema = new Schema<IPlayer>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true, trim: true, unique: true },
        status: {
            type: String,
            required: true,
            enum: Object.values(PlayerStatus),
            default: PlayerStatus.ACTIVE,
        },
        role: {
            type: String,
            required: true,
            enum: Object.values(PlayerRole),
            default: PlayerRole.PLAYER,
        },
        stats: PlayerStatsSchema,
        statsDetail: StatsDetailSchema,
        skillIds: { type: [Schema.Types.ObjectId], ref: "Skill", default: [] },
    },
    { timestamps: true }
);

export const PlayerModel = mongoose.model<IPlayer>("Player", PlayerSchema);
