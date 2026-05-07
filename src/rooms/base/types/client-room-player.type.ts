import { AuthRoomPlayer } from "@/modules/player/types/auth-player.type.js";
import { Client } from "colyseus";

export type ClientRoomPlayer = Client<{ auth: AuthRoomPlayer }>;
