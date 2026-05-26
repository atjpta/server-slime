import { BattleEndReasonEnum } from "@/rooms/battle/enums/battle.enum.js";
import { BattleLogModel, BattleLogDetail } from "@/modules/battle-log/models/battle-log.model.js";
import { BattleLogFilter } from "@/modules/battle-log/validators/battle-log.validator.js";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { Types } from "mongoose";
import { rankMode } from "@/modules/ranking/enums/ranking.enum.js";

export class BattleLogService {
    async createByBattleRoom(room: BattleRoom, winner: string, endReason: BattleEndReasonEnum) {
        const players = [...room.players.values()].map((p) => ({
            player: p._id,
            stats: p.stats,
            skills: room.skills.get(p._id.toString()),
        }));

        const itemWaveLogs = [...room.players.keys()].map((pId) => ({
            player: new Types.ObjectId(pId),
            logs: room.playerItemWaveLogs.get(pId) ?? [],
        }));

        const logs: BattleLogDetail[] = room.logs.map((log) => ({
            wave: log.wave,
            turn: log.turn,
            players: new Map(log.players),
        }));

        await BattleLogModel.create({
            players,
            itemWaveLogs,
            logs,
            winner: winner ? new Types.ObjectId(winner) : null,
            endReason,
            rankMode: room.state.rankMode || rankMode.NORMAL,
        });
    }

    async getList(filter: BattleLogFilter) {
        const { playerId, rankMode, page, limit } = filter;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};
        if (playerId) query["players.player"] = new Types.ObjectId(playerId);
        if (rankMode) query.rankMode = rankMode;
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            BattleLogModel.find(query)
                .select("-logs")
                .sort({ createdAt: -1 })
                .populate([{ path: "players.player", select: "_id name" }])
                .skip(skip)
                .limit(limit)
                .lean()
                .transform((docs) => JSON.parse(JSON.stringify(docs))),
            BattleLogModel.countDocuments(query),
        ]);

        return { items, pagination: { total, page, limit } };
    }

    async getById(id: string) {
        const record = await BattleLogModel.findById(id)
            .populate([{ path: "players.player", select: "_id name" }])
            .lean();
        return JSON.parse(JSON.stringify(record));
    }
}

export const battleLogService = new BattleLogService();
