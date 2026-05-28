import { SkillCode } from "@/modules/skills/enums/skill.enum.js";
import { SkillModel } from "@/modules/skills/models/skill.model.js";

export class SkillService {
    async getSkillDefault() {
        return SkillModel.find({
            code: {
                $in: [SkillCode.ATTACK_001, SkillCode.SPELL_001, SkillCode.DEFENSE_001],
            },
        }).lean();
    }
}

export const skillService = new SkillService();
