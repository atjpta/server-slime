import { SkillType } from "@/modules/skills/enums/skill.enum.js";
import { SkillModel } from "@/modules/skills/models/skill.model.js";
import { skillService } from "@/modules/skills/services/skill.service.js";

export const SkillSeed = async () => {
    const skills = [
        {
            code: skillService.genCodeSkill(SkillType.ATTACK, "001"),
            type: SkillType.ATTACK,
            scale: { attack: 1 },
        },
        {
            code: skillService.genCodeSkill(SkillType.SPELL, "001"),
            type: SkillType.SPELL,
            scale: { magic: 1 },
        },
        {
            code: skillService.genCodeSkill(SkillType.DEFENSE, "001"),
            type: SkillType.DEFENSE,
            scale: { attackEnemy: 1 },
        },
    ];

    await SkillModel.bulkWrite(
        skills.map((skill) => ({
            updateOne: {
                filter: { code: skill.code },
                update: { $set: skill },
                upsert: true,
            },
        }))
    );

    // const skillDefault = await skillService.getSkillDefault();
    // const skillIds = skillDefault.map((e) => e._id);
    // await PlayerModel.updateMany(
    //     { $or: [{ skillIds: { $size: 0 } }, { skillIds: { $exists: false } }] },
    //     { $set: { skillIds } }
    // );
};
