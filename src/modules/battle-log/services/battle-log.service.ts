import { BattleEndReasonEnum } from "@/rooms/battle/enums/battle.enum.js";
import { BattleLogModel, IBattleLogDetail } from "@/modules/battle-log/models/battle-log.model.js";
import { BattleLogFilter } from "@/modules/battle-log/validators/battle-log.validator.js";
import { BattleRoom } from "@/rooms/battle/battle.room.js";
import { Types } from "mongoose";

export class BattleLogService {
    async createByBattleRoom(room: BattleRoom, winner: string, endReason: BattleEndReasonEnum) {
        const players = [...room.players.values()].map((p) => ({
            player: p._id,
            stats: p.stats,
            skills: room.skills.get(p._id.toString()),
        }));

        const logs: IBattleLogDetail[] = room.logs.map((log) => {
            return {
                wave: log.wave,
                turn: log.turn,
                players: new Map(log.players),
            };
        });

        await BattleLogModel.create({
            players,
            logs,
            winner: winner ? new Types.ObjectId(winner) : null,
            endReason,
        });
    }

    async getList(filter: BattleLogFilter) {
        const { playerId, page, limit } = filter;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = playerId ? { "players.player": new Types.ObjectId(playerId) } : {};
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
