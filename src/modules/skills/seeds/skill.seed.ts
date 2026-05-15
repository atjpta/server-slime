import { PlayerModel } from "@/modules/player/models/player.model.js";
import { playerService } from "@/modules/player/services/player.service.js";
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

    // const playerSkillDefault = await playerService.getPlayerSkillDefault();
    // await PlayerModel.updateMany(
    //     { $or: [{ skills: { $size: 0 } }, { skills: { $exists: false } }] },
    //     { $set: { skills: playerSkillDefault } }
    // );

    //   const playerSkillDefault = await playerService.getPlayerSkillDefault();
    //   await PlayerModel.updateMany(
    //       { $or: [{ skills: { $size: 3 } }, { skills: { $exists: false } }] },
    //       { $set: { skills: playerSkillDefault } }
    //   );
};
