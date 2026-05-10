import { SkillType } from "@/modules/skills/enums/skill.enum.js";
import { SkillModel } from "@/modules/skills/models/skill.model.js";
import { Types } from "mongoose";

export class SkillService {
    async getSkillDefault() {
        return SkillModel.find({
            code: {
                $in: [
                    this.genCodeSkill(SkillType.ATTACK, "001"),
                    this.genCodeSkill(SkillType.SPELL, "001"),
                    this.genCodeSkill(SkillType.DEFENSE, "001"),
                ],
            },
        }).lean();
    }

    genCodeSkill(prefix: SkillType, key: string) {
        return `${prefix}-${key}`;
    }
}

export const skillService = new SkillService();
