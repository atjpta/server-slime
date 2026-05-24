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
import { PhaseSelectingBattleCommand } from "@/rooms/battle/commands/phase-selecting.battle.command.js";
import { PhaseSelectingItemBattleCommand } from "@/rooms/battle/commands/phase-selecting-item.battle.command.js";
import { BattlePhaseEnum, BattleTimerEnum } from "@/rooms/battle/enums/battle.enum.js";
import { timerService } from "@/shares/services/timer.service.js";

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
            `actions-${room.roomId}-${playerId}-${wave}`
        );
        room.actions.set(playerId, actions);
        room.state.players.get(playerId)!.ready = true;
    }

    assignBotItem(room: BattleRoom, playerId: string, wave: number) {
        const player = room.state.players.get(playerId)!;
        if (!player.items.length) return;
        const rng = seedrandom(`bot-item-${room.roomId}-${playerId}-${wave}`);
        if (rng() < 0.5) return;
        const itemIndex = Math.floor(rng() * player.items.length);
        const item = player.items[itemIndex];
        const itemApplyIndex = item.rule.scale.damage
            ? Math.floor(rng() * BattleConstants.TURNS_PER_WAVE)
            : undefined;
        room.selectedItems.set(playerId, { itemIndex, itemApplyIndex });
    }

    assignRandomItem(room: BattleRoom, playerId: string) {
        const player = room.state.players.get(playerId)!;
        const availableItems = room.state.items;
        if (player.items.length !== BattleConstants.MAX_ITEM_SLOTS && availableItems.length) {
            const rng = seedrandom(`items-${room.roomId}-${playerId}-${room.state.wave}`);
            const picked = availableItems[Math.floor(rng() * availableItems.length)];
            player.items.push(picked.clone());
        }
        player.ready = true;
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

    canSubmit(room: BattleRoom, playerId: string, phase: BattlePhaseEnum): boolean {
        if (room.state.phase !== phase) return false;
        const player = room.state.players.get(playerId);
        return !!player && !player.ready;
    }

    ifAllReadyAdvance(
        room: BattleRoom,
        timers: BattleTimerEnum[],
        next: Command
    ): Command | undefined {
        const allReady = [...room.state.players.values()].every((p) => p.ready);
        if (!allReady) return;
        timerService.clearTimer(room.timers, timers);
        return next;
    }

    nextSelectingCommand(wave: number): Command {
        return new PhaseSelectingItemBattleCommand();
        // return wave % 2 ? new PhaseSelectingItemBattleCommand() : new PhaseSelectingBattleCommand();
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
            initialPlayers.set(pId, { action: 0, damageReceive: [], stats: { ...player.stats } });
        });
        room.logs.push({ turn: 0, wave: 0, players: initialPlayers });
    }
}

export const battleService = new BattleService();
