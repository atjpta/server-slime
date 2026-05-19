import { PlayerRole, PlayerStatus } from "@/modules/player/enums/player.enum.js";
import { SkillType } from "@/modules/skills/enums/skill.enum.js";
import mongoose, { Document, Schema, Types } from "mongoose";

export interface ScaleValueSkill {
    attack?: number;
    magic?: number;
    attackEnemy?: number;
}

export const ScaleValueSkillSchema = new Schema<ScaleValueSkill>(
    {
        attack: { type: Number },
        magic: { type: Number },
        attackEnemy: { type: Number },
    },
    { timestamps: false, _id: false }
);

export interface Skill extends Document {
    code: string;
    type: SkillType;
    scale: ScaleValueSkill;
    createdAt: Date;
    updatedAt: Date;
}

export const SkillSchema = new Schema<Skill>(
    {
        code: { type: String, required: true, trim: true, unique: true },
        type: {
            type: String,
            required: true,
            enum: Object.values(SkillType),
        },
        scale: ScaleValueSkillSchema,
    },
    { timestamps: true }
);

export const SkillModel = mongoose.model<Skill>("Skill", SkillSchema);
