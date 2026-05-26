import { matchMaker } from "colyseus";
import { QueueOptions } from "@/rooms/queue/queue.room.js";
import { env } from "@/configs/env.config.js";

export class QueueRoomService {
    static GetOptions(matchRoomName: string): QueueOptions {
        return {
            matchRoomName,
            maxPlayers: 2,
            maxWaitingCycles: env.NODE_ENV === "development" ? 3 : 10,
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
