import { IPlayerStats, IStatsDetail, PlayerModel } from "@/modules/player/models/player.model.js";
import { Types } from "mongoose";

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

    async getById(id: string) {
        return PlayerModel.findById(id).lean();
    }

    async delete(id: string) {
        return PlayerModel.findByIdAndDelete(id).lean();
    }

    public getStatsInit() {
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

    public calStatsDetail(statsDetail: IStatsDetail): IPlayerStats {
        const hp = Object.values(statsDetail.hp).reduce((sum, val) => sum + val, 0);
        const attack = Object.values(statsDetail.attack).reduce((sum, val) => sum + val, 0);
        const magic = Object.values(statsDetail.magic).reduce((sum, val) => sum + val, 0);
        const defense = Object.values(statsDetail.defense).reduce((sum, val) => sum + val, 0);
        return { hp, attack, magic, defense };
    }
}

export const playerService = new PlayerService();
