import { RankTierConfigModel } from "@/modules/ranking/models/rank-tier-config.model.js";

const tierConfigs = [
    { code: "bronze", minPoint: 0 },
    { code: "silver", minPoint: 1100 },
    { code: "gold", minPoint: 1200 },
    { code: "platinum", minPoint: 1300 },
    { code: "emerald", minPoint: 1500 },
    { code: "diamond", minPoint: 1800 },
    { code: "master", minPoint: 2500 },
];

export const RankTierConfigSeed = async () => {
    await RankTierConfigModel.bulkWrite(
        tierConfigs.map((tier) => ({
            updateOne: {
                filter: { code: tier.code },
                update: { $set: tier },
                upsert: true,
            },
        }))
    );
};
