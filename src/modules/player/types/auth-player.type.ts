import { JwtPayload } from "colyseus";
import { Types } from "mongoose";

export type AuthRoomPlayer = { userId: Types.ObjectId; playerId: Types.ObjectId } & JwtPayload;
