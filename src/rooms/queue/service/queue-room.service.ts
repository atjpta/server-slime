import { matchMaker } from "colyseus";
import { QueueOptions } from "@/rooms/queue/queue.room.js";
import { BattleConstants } from "@/rooms/battle/constants/battle.constants.js";

export class QueueRoomService {
    static GetOptions(matchRoomName: string): QueueOptions {
        return {
            matchRoomName,
            maxPlayers: 2,
            maxWaitingCycles: BattleConstants.BOT_WAIT_S,
            maxWaitingCyclesForPriority: 8,
            allowIncompleteGroups: true,
            onGroupReady: async function (group) {
                const withBot = group.clients.length < this.maxPlayers;
                const rankMode = group.clients[0]?.userData?.options?.rankMode;
                return matchMaker.createRoom(this.matchRoomName, { withBot, rankMode });
            },
        };
    }
}
