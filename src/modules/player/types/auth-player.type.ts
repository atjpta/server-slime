import { JwtPayload } from "colyseus";
import { Types } from "mongoose";

export type AuthRoomPlayer = { playerId: Types.ObjectId } & JwtPayload;
