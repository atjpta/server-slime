import { matchMaker } from "colyseus";
import { QueueOptions } from "@/rooms/queue/queue.room.js";

export class QueueRoomService {
    static GetOptions(matchRoomName: string): QueueOptions {
        return {
            matchRoomName,
            maxPlayers: 2,
            maxWaitingCycles: 10,
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
