import { InventoryItem, InventoryModel } from "@/modules/inventory/models/inventory.model.js";
import { PlayerModel } from "@/modules/player/models/player.model.js";

export const InventorySeed = async () => {
    const players = await PlayerModel.find({}, { _id: 1 }).lean();
    if (!players.length) return;

    await InventoryModel.bulkWrite(
        players.map((p) => ({
            updateOne: {
                filter: { player: p._id },
                update: { $setOnInsert: { items: [] as InventoryItem[] } },
                upsert: true,
            },
        }))
    );
};
