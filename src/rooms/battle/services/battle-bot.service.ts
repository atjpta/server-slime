import seedrandom from "seedrandom";
import { playerService } from "@/modules/player/services/player.service.js";
import { OnJoinBattleCommand } from "@/rooms/battle/commands/on-join.battle.command.js";
import { SubmitActionsBattleCommand } from "@/rooms/battle/commands/submit-actions.battle.command.js";
import { SubmitSelectItemBattleCommand } from "@/rooms/battle/commands/submit-select-item.battle.command.js";
import { battleService } from "@/rooms/battle/services/battle.service.js";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { SubmitExecutingDoneBattleCommand } from "@/rooms/battle/commands/submit-executing-done.battle.command.js";

export class BattleBotService {
    async onJoin(room: BattleRoom): Promise<void> {
        const bot = await playerService.getRandomBot();
        if (!bot) return;
        const botId = bot._id.toString();
        room.botPlayerId = botId;
        room.dispatcher.dispatch(new OnJoinBattleCommand(), { playerId: botId });
    }

    submitActions(room: BattleRoom): void {
        const botId = room.botPlayerId;
        if (!botId) return;

        const actions = battleService.getActionRandom(
            room,
            room.skills.get(botId)!,
            `actions-${room.roomId}-${botId}-${room.state.wave}`
        );

        let itemIndex: number | undefined;
        let itemApplyIndex: number | undefined;
        const player = room.state.players.get(botId)!;
        if (player.items.length) {
            const rng = seedrandom(`bot-item-${room.roomId}-${botId}-${room.state.wave}`);
            if (rng() >= 0.5) {
                itemIndex = Math.floor(rng() * player.items.length);
                const item = player.items[itemIndex];
                itemApplyIndex = item.rule.scale?.damage
                    ? Math.floor(rng() * room.config.turnsPerWave)
                    : undefined;
            }
        }

        room.dispatcher.dispatch(new SubmitActionsBattleCommand(), {
            playerId: botId,
            actions,
            itemIndex,
            itemApplyIndex,
        });
    }

    submitSelectItem(room: BattleRoom): void {
        const botId = room.botPlayerId;
        if (!botId) return;

        const player = room.state.players.get(botId)!;
        const availableItems = room.state.items;
        let itemIndex: number | undefined;
        if (player.items.length < room.config.maxItemSlots && availableItems.length) {
            const rng = seedrandom(`items-${room.roomId}-${botId}-${room.state.wave}`);
            itemIndex = Math.floor(rng() * availableItems.length);
        }

        room.dispatcher.dispatch(new SubmitSelectItemBattleCommand(), {
            playerId: botId,
            itemIndex,
        });
    }
    submitExecuteDone(room: BattleRoom): void {
        const botId = room.botPlayerId;
        if (!botId) return;

        room.dispatcher.dispatch(new SubmitExecutingDoneBattleCommand(), {
            playerId: botId,
        });
    }
}

export const battleBotService = new BattleBotService();
