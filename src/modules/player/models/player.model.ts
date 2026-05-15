import { User } from "@/modules/auth/models/user.model.js";
import { PlayerRole, PlayerStatus } from "@/modules/player/enums/player.enum.js";
import { Skill } from "@/modules/skills/models/skill.model.js";
import mongoose, { Document, Schema } from "mongoose";

export interface PlayerSkill {
    skill: Skill;
    orderIndex: number;
}

export interface PlayerStats {
    hp: number;
    attack: number;
    magic: number;
    defense: number;
}

export interface Player extends Document {
    user: User;
    name: string;
    role: PlayerRole;
    status: PlayerStatus;
    stats: PlayerStats;
    statsDetail: IStatsDetail;
    skills: PlayerSkill[];
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

const PlayerSkillSchema = new Schema<PlayerSkill>(
    {
        skill: { type: Schema.Types.ObjectId, ref: "Skill", required: true },
        orderIndex: { type: Number, required: true },
    },
    { _id: false }
);

export const PlayerStatsSchema = new Schema<PlayerStats>(
    {
        hp: { type: Number, required: true },
        attack: { type: Number, required: true },
        magic: { type: Number, required: true },
        defense: { type: Number, required: true },
    },
    { _id: false }
);

export const PlayerSchema = new Schema<Player>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
        skills: { type: [PlayerSkillSchema], default: [] },
    },
    { timestamps: true }
);

export const PlayerModel = mongoose.model<Player>("Player", PlayerSchema);
