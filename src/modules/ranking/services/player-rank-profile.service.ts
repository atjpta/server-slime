import { RankLadderStatus, RuleSet } from "@/modules/ranking/models/rank-ladder.model.js";
import { RankLadderModel } from "@/modules/ranking/models/rank-ladder.model.js";
import type { rankMode } from "@/modules/ranking/enums/ranking.enum.js";
import { PlayerRankProfileModel } from "@/modules/ranking/models/player-rank-profile.model.js";
import { RankTierConfigModel } from "@/modules/ranking/models/rank-tier-config.model.js";
import { Types } from "mongoose";

export class PlayerRankProfileService {
    async getPlayerRankProfiles(playerId: Types.ObjectId, rankModeFilter?: string) {
        const query: Record<string, unknown> = { player: playerId };
        if (rankModeFilter) query.rankMode = rankModeFilter;
        return PlayerRankProfileModel.find(query)
            .populate("tier")
            .populate("highestTier")
            .lean()
            .transform((docs) => JSON.parse(JSON.stringify(docs)));
    }

    async getByPlayerAndRankMode(playerId: Types.ObjectId, rankModeValue: string) {
        return PlayerRankProfileModel.findOne({ player: playerId, rankMode: rankModeValue })
            .populate("tier")
            .populate("highestTier")
            .lean()
            .transform((doc) => (doc ? JSON.parse(JSON.stringify(doc)) : null));
    }

    async getPlayerRankPosition(playerId: Types.ObjectId, rankModeValue: string) {
        const profile = await PlayerRankProfileModel.findOne({
            player: playerId,
            rankMode: rankModeValue,
        })
            .populate("tier")
            .lean()
            .transform((doc) => (doc ? JSON.parse(JSON.stringify(doc)) : null));
        if (!profile) return null;

        const rank =
            (await PlayerRankProfileModel.countDocuments({
                rankMode: rankModeValue,
                point: { $gt: profile.point },
            })) + 1;

        return { rank, profile };
    }

    async getLeaderboard(rankModeValue: string, page: number, limit: number) {
        const skip = (page - 1) * limit;
        const query = { rankMode: rankModeValue };

        const [items, total] = await Promise.all([
            PlayerRankProfileModel.find(query)
                .sort({ point: -1 })
                .skip(skip)
                .limit(limit)
                .populate({ path: "player", select: "_id name" })
                .populate("tier")
                .lean()
                .transform((docs) => JSON.parse(JSON.stringify(docs))),
            PlayerRankProfileModel.countDocuments(query),
        ]);

        return { items, pagination: { total, page, limit } };
    }

    async initPlayerRankProfiles(playerId: Types.ObjectId) {
        const [ladders, lowestTier] = await Promise.all([
            RankLadderModel.find({ status: RankLadderStatus.ACTIVE }).lean<
                { _id: Types.ObjectId; rankMode: rankMode; ruleSet: RuleSet }[]
            >(),
            RankTierConfigModel.findOne().sort({ minPoint: 1 }).lean<{ _id: Types.ObjectId }>(),
        ]);

        if (!lowestTier || ladders.length === 0) return;

        await PlayerRankProfileModel.bulkWrite(
            ladders.map((ladder) => ({
                updateOne: {
                    filter: { player: playerId, rankLadder: ladder._id },
                    update: {
                        $setOnInsert: {
                            player: playerId,
                            rankLadder: ladder._id,
                            rankMode: ladder.rankMode,
                            point: ladder.ruleSet.initialPoint,
                            tier: lowestTier._id,
                            highestTier: lowestTier._id,
                            highestRating: ladder.ruleSet.initialPoint,
                        },
                    },
                    upsert: true,
                },
            }))
        );
    }
}

export const playerRankProfileService = new PlayerRankProfileService();
