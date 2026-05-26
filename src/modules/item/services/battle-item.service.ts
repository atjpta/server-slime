import {
    BattleItemModel,
    BattleItem,
    BattleItemStatus,
} from "@/modules/item/models/battle-item.model.js";

export class BattleItemService {
    async index(): Promise<BattleItem[]> {
        return BattleItemModel.find({ status: BattleItemStatus.ACTIVE }).lean();
    }

    async getRandomItems(count: number): Promise<BattleItem[]> {
        return BattleItemModel.aggregate([
            { $match: { status: BattleItemStatus.ACTIVE } },
            { $addFields: { score: { $pow: [{ $rand: {} }, { $divide: [1, "$weight"] }] } } },
            { $sort: { score: -1 } },
            { $limit: count },
            { $unset: "score" },
        ]);
    }
}

export const battleItemService = new BattleItemService();
