import { RankLadderStatus } from "@/modules/ranking/models/rank-ladder.model.js";
import { RankLadderModel } from "@/modules/ranking/models/rank-ladder.model.js";
import { RankTierConfigModel } from "@/modules/ranking/models/rank-tier-config.model.js";

export class RankConfigService {
    async getRankConfig() {
        const [ladders, tiers] = await Promise.all([
            RankLadderModel.find({ status: RankLadderStatus.ACTIVE }).lean(),
            RankTierConfigModel.find().sort({ minPoint: 1 }).lean(),
        ]);
        return { ladders, tiers };
    }
}

export const rankConfigService = new RankConfigService();
