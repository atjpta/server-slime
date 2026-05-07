import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { QueueRoomService } from "@/rooms/queue/service/queue-room.service.js";
import { defineRoom, QueueRoom } from "colyseus";

export const rooms = {
    battle: defineRoom(BattleRoom),
    queue: defineRoom(QueueRoom, QueueRoomService.GetOptions("battle")),
};
