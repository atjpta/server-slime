import {
    BattleEndReasonEnum,
    BattleEventEnum,
    BattleResultEnum,
} from "@/rooms/battle/enums/battle.enum.js";
import { RankLadderModel, RuleSet } from "@/modules/ranking/models/rank-ladder.model.js";
import { PlayerRankProfileModel } from "@/modules/ranking/models/player-rank-profile.model.js";
import { RankHistoryModel } from "@/modules/ranking/models/rank-history.model.js";
import { RankTierConfigModel } from "@/modules/ranking/models/rank-tier-config.model.js";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { AnyBulkWriteOperation, Types } from "mongoose";

export interface RankChange {
    playerId: string;
    oldPoint: number;
    newPoint: number;
    point: number;
    result: BattleResultEnum;
}

export class RankBattleService {
    async processRankResult(
        room: BattleRoom,
        winner: string,
        endReason: BattleEndReasonEnum
    ): Promise<RankChange[]> {
        const rankMode = room.state.rankMode;
        if (!rankMode) return [];

        const ladder = await RankLadderModel.findOne({ rankMode }).lean<{
            _id: Types.ObjectId;
            rankMode: string;
            ruleSet: RuleSet;
        }>();
        if (!ladder) return [];

        const [p1Id, p2Id] = [...room.players.keys()];

        const isDraw = endReason === BattleEndReasonEnum.DRAW;
        const getResult = (id: string): BattleResultEnum => {
            if (isDraw) return BattleResultEnum.DRAW;
            return winner === id ? BattleResultEnum.WIN : BattleResultEnum.LOSE;
        };

        const [p1Profile, p2Profile, tiers] = await Promise.all([
            PlayerRankProfileModel.findOne({ player: new Types.ObjectId(p1Id), rankMode }).lean(),
            PlayerRankProfileModel.findOne({ player: new Types.ObjectId(p2Id), rankMode }).lean(),
            RankTierConfigModel.find().sort({ minPoint: -1 }).lean(),
        ]);

        if (!p1Profile && !p2Profile) return [];
        if (tiers.length === 0) return [];

        const findTier = (point: number) =>
            tiers.find((t) => t.minPoint <= point) ?? tiers[tiers.length - 1];

        const calcNewPoint = (oldPoint: number, result: BattleResultEnum): number => {
            if (result === BattleResultEnum.WIN) return oldPoint + ladder.ruleSet.winPoint;
            if (result === BattleResultEnum.LOSE)
                return Math.max(0, oldPoint - ladder.ruleSet.losePoint);
            return oldPoint;
        };

        const rankChanges: RankChange[] = [];
        const bulkOps: AnyBulkWriteOperation[] = [];

        const buildUpdate = (profile: NonNullable<typeof p1Profile>, result: BattleResultEnum) => {
            const oldPoint = profile.point;
            const newPoint = calcNewPoint(oldPoint, result);
            const newTier = findTier(newPoint);

            const highestTierId = profile.highestTier
                ? (profile.highestTier as Types.ObjectId).toString()
                : null;
            const currentHighestTier = highestTierId
                ? tiers.find((t) => t._id.toString() === highestTierId)
                : null;
            const isNewHighestTier = newTier.minPoint > (currentHighestTier?.minPoint ?? -1);

            rankChanges.push({
                playerId: profile.player.toString(),
                oldPoint,
                newPoint,
                point: newPoint - oldPoint,
                result,
            });

            return {
                point: newPoint,
                tier: newTier._id,
                totalMatch: profile.totalMatch + 1,
                win: profile.win + (result === BattleResultEnum.WIN ? 1 : 0),
                lose: profile.lose + (result === BattleResultEnum.LOSE ? 1 : 0),
                draw: profile.draw + (result === BattleResultEnum.DRAW ? 1 : 0),
                winStreak: result === BattleResultEnum.WIN ? profile.winStreak + 1 : 0,
                loseStreak: result === BattleResultEnum.LOSE ? profile.loseStreak + 1 : 0,
                highestRating: Math.max(profile.highestRating, newPoint),
                highestTier: isNewHighestTier ? newTier._id : profile.highestTier,
            };
        };

        if (p1Profile) {
            bulkOps.push({
                updateOne: {
                    filter: { _id: p1Profile._id },
                    update: { $set: buildUpdate(p1Profile, getResult(p1Id)) },
                },
            });
        }

        if (p2Profile) {
            bulkOps.push({
                updateOne: {
                    filter: { _id: p2Profile._id },
                    update: { $set: buildUpdate(p2Profile, getResult(p2Id)) },
                },
            });
        }

        await Promise.all([
            PlayerRankProfileModel.bulkWrite(bulkOps),
            RankHistoryModel.create({
                rankLadder: ladder._id,
                rankMode: ladder.rankMode,
                players: rankChanges.map((c) => ({
                    player: new Types.ObjectId(c.playerId),
                    oldPoint: c.oldPoint,
                    newPoint: c.newPoint,
                    point: c.point,
                    result: c.result,
                })),
            }),
        ]);

        return rankChanges;
    }

    broadcastRankChanges(room: BattleRoom, rankChanges: RankChange[]) {
        rankChanges.forEach((change) => {
            const client = room.clients.find(
                (c) => c.auth?.playerId?.toString() === change.playerId
            );
            client?.send(BattleEventEnum.RANK_UPDATE, {
                oldPoint: change.oldPoint,
                newPoint: change.newPoint,
                point: change.point,
                result: change.result,
            });
        });
    }
}

export const rankBattleService = new RankBattleService();
