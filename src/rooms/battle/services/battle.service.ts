import seedrandom from "seedrandom";
import { Command } from "@colyseus/command";
import { Player, PlayerSkill } from "@/modules/player/models/player.model.js";
import { Skill } from "@/modules/skills/models/skill.model.js";
import { BattleConstants } from "@/rooms/battle/constants/battle.constants.js";
import { PlayerTurnLog } from "@/modules/battle-log/models/battle-log.model.js";
import { BattlePlayerState } from "@/rooms/battle/schema/player.battle.state.js";
import type { PlayerRankProfile } from "@/modules/ranking/models/player-rank-profile.model.js";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { PhaseEndedBattleCommand } from "@/rooms/battle/commands/phase-ended.battle.command.js";

export class BattleService {
    getActionRandom(skills: Skill[], seed: string): number[] {
        const rng = seedrandom(seed);
        return Array.from({ length: BattleConstants.TURNS_PER_WAVE }, () =>
            Math.floor(rng() * skills.length)
        );
    }

    genSkillArray(playerSkills: PlayerSkill[]): Skill[] {
        return [...playerSkills].sort((a, b) => a.orderIndex - b.orderIndex).map((ps) => ps.skill);
    }

    assignRandomAction(room: BattleRoom, playerId: string, wave: number) {
        const actions = this.getActionRandom(
            room.skills.get(playerId)!,
            `${room.roomId}-${playerId}-${wave}`
        );
        room.actions.set(playerId, actions);
        room.state.players.get(playerId)!.ready = true;
    }

    registerPlayer(
        room: BattleRoom,
        playerId: string,
        player: Player,
        rankProfile: PlayerRankProfile | null
    ) {
        room.state.players.set(playerId, BattlePlayerState.from(player));
        room.players.set(playerId, player);
        room.skills.set(playerId, this.genSkillArray(player.skills));
        room.rankProfiles.set(playerId, rankProfile);
    }

    nextOrEndPhaseCommand(room: BattleRoom, next: Command): Command {
        if (room.result) {
            return new PhaseEndedBattleCommand().setPayload(room.result);
        }
        return next;
    }

    initBattleLogs(room: BattleRoom) {
        const initialPlayers = new Map<string, PlayerTurnLog>();
        room.players.forEach((player, pId) => {
            initialPlayers.set(pId, {
                action: 0,
                damageReceive: [],
                stats: { ...player.stats },
            });
        });
        room.logs.push({ turn: 0, wave: 0, players: initialPlayers });
    }
}

export const battleService = new BattleService();
