import seedrandom from "seedrandom";
import {
    BattleItemModel,
    BattleItem,
    BattleItemStatus,
} from "@/modules/item/models/battle-item.model.js";

export class BattleItemService {
    async getRandomItems(count: number, seed: string): Promise<BattleItem[]> {
        const items = await BattleItemModel.find({ status: BattleItemStatus.ACTIVE }).lean();
        if (!items.length) return [];
        const rng = seedrandom(seed);
        return Array.from(
            { length: count },
            () => items[Math.floor(rng() * items.length)]
        ) as BattleItem[];
    }
}

export const battleItemService = new BattleItemService();
