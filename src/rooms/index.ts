import { defineRoom } from "colyseus";
import { MyRoom } from "@/rooms/MyRoom.js";

export const rooms = {
    my_room: defineRoom(MyRoom),
};
