import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { QueueRoom } from "@/rooms/queue/queue.room.js";
import { QueueRoomService } from "@/rooms/queue/service/queue-room.service.js";
import { defineRoom } from "colyseus";

export const createRooms = () => ({
    battle: defineRoom(BattleRoom),
    queue: defineRoom(QueueRoom, QueueRoomService.GetOptions("battle")),
});
