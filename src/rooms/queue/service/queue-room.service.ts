import { QueueOptions } from "@/rooms/queue/queue.room.js";

export class QueueRoomService {
    static GetOptions(matchRoomName: string): QueueOptions {
        return {
            matchRoomName,
            maxPlayers: 2,
            maxWaitingCycles: 15,
            maxWaitingCyclesForPriority: 10,
        };
    }
}
