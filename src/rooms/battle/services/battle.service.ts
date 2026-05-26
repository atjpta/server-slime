import seedrandom from "seedrandom";
import { Command } from "@colyseus/command";
import { PlayerSkill } from "@/modules/player/models/player.model.js";
import { Skill } from "@/modules/skills/models/skill.model.js";
import { PlayerTurnLog } from "@/modules/battle-log/models/battle-log.model.js";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { PhaseEndedBattleCommand } from "@/rooms/battle/commands/phase-ended.battle.command.js";
import { PhaseSelectingItemBattleCommand } from "@/rooms/battle/commands/phase-selecting-item.battle.command.js";
import { BattlePhaseEnum, BattleTimerEnum } from "@/rooms/battle/enums/battle.enum.js";
import { timerService } from "@/shares/services/timer.service.js";
import { PhaseSelectingBattleCommand } from "@/rooms/battle/commands/phase-selecting.battle.command.js";

export class BattleService {
    getActionRandom(room: BattleRoom, skills: Skill[], seed: string): number[] {
        const rng = seedrandom(seed);
        return Array.from({ length: room.config.turnsPerWave }, () =>
            Math.floor(rng() * skills.length)
        );
    }

    genSkillArray(playerSkills: PlayerSkill[]): Skill[] {
        return [...playerSkills].sort((a, b) => a.orderIndex - b.orderIndex).map((ps) => ps.skill);
    }

    assignRandomAction(room: BattleRoom, playerId: string, wave: number) {
        const actions = this.getActionRandom(
            room,
            room.skills.get(playerId)!,
            `actions-${room.roomId}-${playerId}-${wave}`
        );
        room.actions.set(playerId, actions);
        room.state.players.get(playerId)!.ready = true;
    }

    assignRandomItem(room: BattleRoom, playerId: string) {
        const player = room.state.players.get(playerId)!;
        const offeredItems = player.offeredItems;
        if (player.items.length !== room.config.maxItemSlots && offeredItems.length) {
            const rng = seedrandom(`items-${room.roomId}-${playerId}-${room.state.wave}`);
            const picked = offeredItems[Math.floor(rng() * offeredItems.length)];
            const log = room.waveItemLogs.get(playerId);
            if (log) log.pickedItem = { code: picked.code, type: picked.type, rule: { phase: picked.rule.phase, scale: { hp: picked.rule.scale.hp, damage: picked.rule.scale.damage } } };
            player.items.push(picked.clone());
        }
        player.ready = true;
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
        // return new PhaseSelectingItemBattleCommand();
        return wave % 2 ? new PhaseSelectingItemBattleCommand() : new PhaseSelectingBattleCommand();
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
