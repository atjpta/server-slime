import { MasterDataKey } from "@/modules/master-data/enums/master-data.enum.js";
import { MasterDataModel } from "@/modules/master-data/models/master-data.model.js";

const entries = [
    {
        key: MasterDataKey.BATTLE_CONFIG,
        note: "Cấu hình thông số trận đấu",
        value: {
            maxWave: 10,
            turnsPerWave: 5,
            maxItemSlots: 3,
            selectItemOfferCount: 3,
            selectionTimeMs: 30000,
            selectionTimeOutMs: 32000,
            selectionItemTimeMs: 10000,
            selectionItemTimeOutMs: 12000,
            waveAnimationMs: 5000,
            executingDoneTimeoutMs: 10000,
            endedDelayMs: 3000,
            reconnectionS: 60,
        },
    },
    {
        key: MasterDataKey.INVENTORY_CONFIG,
        note: "Cấu hình thông số túi đồ của player",
        value: {
            maxStack: 9999,
            maxLength: 50,
        },
    },
];

export const MasterDataSeed = async () => {
    await MasterDataModel.bulkWrite(
        entries.map((entry) => ({
            updateOne: {
                filter: { key: entry.key },
                update: { $set: entry },
                upsert: true,
            },
        }))
    );
};
