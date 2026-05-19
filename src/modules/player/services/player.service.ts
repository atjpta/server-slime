import { env } from "@/configs/env.config.js";
import {
    Player,
    PlayerStats,
    PlayerModel,
    StatsDetail,
} from "@/modules/player/models/player.model.js";
import { PlayerFilter } from "@/modules/player/validators/player.validator.js";
import { PlayerRole } from "@/modules/player/enums/player.enum.js";
import { paginateQueryBuilder } from "@/shares/services/pagination.service.js";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { AuthRoomPlayer } from "@/modules/player/types/auth-player.type.js";
import { skillService } from "@/modules/skills/services/skill.service.js";
import { playerRankProfileService } from "@/modules/ranking/services/player-rank-profile.service.js";

export class PlayerService {
    async create(userId: Types.ObjectId, name: string) {
        const exist = await PlayerModel.findOne({ name }).lean();
        if (exist) {
            return;
        }
        const stats = this.getStatsInit();
        const skillDefault = await skillService.getSkillDefault();
        const skills = skillDefault.map((e, index) => ({
            skill: e._id,
            orderIndex: index + 1,
        }));
        const player = await PlayerModel.create({
            user: userId,
            name,
            stats: stats.statsInit,
            statsDetail: stats.statsDetailInit,
            skills,
        });
        await playerRankProfileService.initPlayerRankProfiles(player._id);
        return player.toObject();
    }

    async getById(id: Types.ObjectId | string) {
        return PlayerModel.findById(id).populate("skills.skill").lean();
    }

    async getRandomBot() {
        const count = await PlayerModel.countDocuments({ role: PlayerRole.BOT });
        if (count === 0) return null;
        const skip = Math.floor(Math.random() * count);
        return PlayerModel.findOne({ role: PlayerRole.BOT })
            .skip(skip)
            .populate("skills.skill")
            .lean();
    }

    async getList(
        filter: PlayerFilter,
        userId: Types.ObjectId,
        select?: (keyof Player & string)[]
    ) {
        return paginateQueryBuilder<Player>(PlayerModel, { user: userId }, filter, select);
    }

    async delete(id: string) {
        return PlayerModel.findByIdAndDelete(id).lean();
    }

    getStatsInit() {
        const statsDetailInit: StatsDetail = {
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

    calStatsDetail(statsDetail: StatsDetail): PlayerStats {
        const hp = Object.values(statsDetail.hp).reduce((sum, val) => sum + val, 0);
        const attack = Object.values(statsDetail.attack).reduce((sum, val) => sum + val, 0);
        const magic = Object.values(statsDetail.magic).reduce((sum, val) => sum + val, 0);
        const defense = Object.values(statsDetail.defense).reduce((sum, val) => sum + val, 0);
        return { hp, attack, magic, defense };
    }

    async selectPlayer(userId: Types.ObjectId, id: string) {
        const player = await PlayerModel.findOne({ user: userId, _id: id }).lean();
        if (!player) {
            return;
        }

        const token = jwt.sign({ playerId: player._id, userId }, env.JWT_SECRET, {
            expiresIn: "30d",
        });
        return { token };
    }

    verifyToken(token: string) {
        return jwt.verify(token, env.JWT_SECRET) as AuthRoomPlayer;
    }

    async getPlayerSkillDefault() {
        const skillDefault = await skillService.getSkillDefault();
        const playerSkills = skillDefault.map((e, index) => ({ skill: e._id, orderIndex: index }));
        return playerSkills;
    }
}

export const playerService = new PlayerService();
