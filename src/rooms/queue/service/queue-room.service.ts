import { matchMaker, QueueOptions } from "colyseus";

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
