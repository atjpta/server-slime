import { AuthRoomPlayer } from "@/modules/player/types/auth-player.type.js";
import { AuthContext, JWT, Room } from "colyseus";

export abstract class BaseRoomPlayer extends Room {
    static async onAuth(token: string, options: any, context: AuthContext) {
        const userdata = await JWT.verify(token);
        return userdata as AuthRoomPlayer;
    }
}
