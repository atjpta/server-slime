import { PlayerRole, PlayerStatus } from "@/modules/player/enums/player.enum.js";
import { SkillType } from "@/modules/skills/enums/skill.enum.js";
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IscaleValueSkill {
    attack?: number;
    magic?: number;
    attackEnemy?: number;
}

const ScaleValueSkillSchema = new Schema<IscaleValueSkill>(
    {
        attack: { type: Number },
        magic: { type: Number },
        attackEnemy: { type: Number },
    },
    { timestamps: false, _id: false }
);

export interface ISkill extends Document {
    code: string;
    type: SkillType;
    scale: IscaleValueSkill;
    createdAt: Date;
    updatedAt: Date;
}

export const SkillSchema = new Schema<ISkill>(
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

export const SkillModel = mongoose.model<ISkill>("Skill", SkillSchema);
