import { Player, PlayerStats } from "@/modules/player/models/player.model.js";
import { ScaleValueSkill, Skill } from "@/modules/skills/models/skill.model.js";
import { BattleLogDetail } from "@/modules/battle-log/models/battle-log.model.js";

export type ScaleStatKey = keyof ScaleValueSkill & keyof PlayerStats;

export interface InitLogsRoom {
    players: Map<string, Player>;
    logs: BattleLogDetail[];
}

export interface UpdateStatsBattle {
    skill: Skill;
    stats: PlayerStats;
    damageBuff?: number;
}
