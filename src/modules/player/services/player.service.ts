import { env } from "@/configs/env.config.js";
import {
    IPlayer,
    IPlayerStats,
    IStatsDetail,
    PlayerModel,
} from "@/modules/player/models/player.model.js";
import { PlayerFilter } from "@/modules/player/validators/player.validator.js";
import { paginateQueryBuilder } from "@/shares/services/pagination.service.js";
import { Types } from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthRoomPlayer } from "@/modules/player/types/auth-player.type.js";

export class PlayerService {
    async create(userId: Types.ObjectId, name: string) {
        const exist = await PlayerModel.findOne({ name }).lean();
        if (exist) {
            return;
        }
        const stats = this.getStatsInit();
        const player = await PlayerModel.create({
            userId,
            name,
            stats: stats.statsInit,
            statsDetail: stats.statsDetailInit,
        });
        return player.toObject();
    }

    async getById(id: Types.ObjectId) {
        return PlayerModel.findById(id).lean();
    }

    async getList(
        filter: PlayerFilter,
        userId: Types.ObjectId,
        select?: (keyof IPlayer & string)[]
    ) {
        return paginateQueryBuilder<IPlayer>(PlayerModel, { userId }, filter, select);
    }

    async delete(id: string) {
        return PlayerModel.findByIdAndDelete(id).lean();
    }

    getStatsInit() {
        const statsDetailInit: IStatsDetail = {
            hp: {
                base: 1000,
            },
            attack: {
                base: 100,
            },
            magic: {
                base: 100,
            },
            defense: {
                base: 10,
            },
        };
        const statsInit = this.calStatsDetail(statsDetailInit);

        return { statsDetailInit, statsInit };
    }

    calStatsDetail(statsDetail: IStatsDetail): IPlayerStats {
        const hp = Object.values(statsDetail.hp).reduce((sum, val) => sum + val, 0);
        const attack = Object.values(statsDetail.attack).reduce((sum, val) => sum + val, 0);
        const magic = Object.values(statsDetail.magic).reduce((sum, val) => sum + val, 0);
        const defense = Object.values(statsDetail.defense).reduce((sum, val) => sum + val, 0);
        return { hp, attack, magic, defense };
    }

    async selectPlayer(userId: Types.ObjectId, id: string) {
        const player = await PlayerModel.findOne({ userId, _id: id }).lean();
        if (!player) {
            return;
        }

        const token = jwt.sign({ playerId: player._id }, env.JWT_SECRET, {
            expiresIn: "30d",
        });
        return { token };
    }

    verifyToken(token: string) {
        return jwt.verify(token, env.JWT_SECRET) as AuthRoomPlayer;
    }
}

export const playerService = new PlayerService();
