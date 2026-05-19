import { PlayerModel } from "@/modules/player/models/player.model.js";
import { playerRankProfileService } from "@/modules/ranking/services/player-rank-profile.service.js";
import { Types } from "mongoose";

export const PlayerRankProfileSeed = async () => {
    const players = await PlayerModel.find({}, { _id: 1 }).lean();
    await Promise.all(
        players.map((p) => playerRankProfileService.initPlayerRankProfiles(p._id as Types.ObjectId))
    );
};
