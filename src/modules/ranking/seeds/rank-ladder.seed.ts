import { rankMode } from "@/modules/ranking/enums/ranking.enum.js";
import { RankLadderStatus, RankLadderModel } from "@/modules/ranking/models/rank-ladder.model.js";

const rankLadders = [
    {
        rankMode: rankMode.UNLIMIT,
        name: "Rank Unlimit",
        ruleSet: { initialPoint: 1000, winPoint: 75, losePoint: 15 },
        status: RankLadderStatus.ACTIVE,
    },
    {
        rankMode: rankMode.BALANCE,
        name: "Rank Balance",
        ruleSet: { initialPoint: 1000, winPoint: 75, losePoint: 12 },
        status: RankLadderStatus.ACTIVE,
    },
];

export const RankLadderSeed = async () => {
    await RankLadderModel.bulkWrite(
        rankLadders.map((ladder) => ({
            updateOne: {
                filter: { rankMode: ladder.rankMode },
                update: { $set: ladder },
                upsert: true,
            },
        }))
    );
};
