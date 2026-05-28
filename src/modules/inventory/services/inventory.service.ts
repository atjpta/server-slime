import {
    Inventory,
    InventoryItem,
    InventoryModel,
} from "@/modules/inventory/models/inventory.model.js";
import { ItemRarity, ItemSource } from "@/modules/item/enums/item.enum.js";
import mongoose, { Types } from "mongoose";

export interface AddInventoryItemDto {
    item: string;
    quantity: number;
    orderIndex: number;
    rarity: ItemRarity;
    source: ItemSource;
    metadata?: Record<string, unknown>;
}

export class InventoryService {
    async initPlayerInventory(playerId: string): Promise<Inventory> {
        return InventoryModel.findOneAndUpdate(
            { player: playerId },
            {
                $setOnInsert: {
                    player: new mongoose.Types.ObjectId(playerId),
                    items: [] as InventoryItem[],
                },
            },
            { returnDocument: "after", upsert: true }
        ) as Promise<Inventory>;
    }

    async getByPlayerId(playerId: string): Promise<Inventory | null> {
        return InventoryModel.findOne({ player: playerId }).populate("items.item").lean();
    }

    async addItem(playerId: string, dto: AddInventoryItemDto): Promise<Inventory | null> {
        return InventoryModel.findOneAndUpdate(
            { player: playerId },
            { $push: { items: dto } },
            { returnDocument: "after", upsert: true }
        ).lean();
    }

    async removeItem(playerId: string, inventoryItemId: string): Promise<Inventory | null> {
        return InventoryModel.findOneAndUpdate(
            { player: playerId },
            {
                $pull: {
                    items: {
                        _id: new Types.ObjectId(inventoryItemId),
                    },
                },
            },
            { returnDocument: "after" }
        ).lean();
    }

    async toggleLock(playerId: string, inventoryItemId: string): Promise<Inventory | null> {
        const inventory = await InventoryModel.findOne({ player: playerId });
        if (!inventory) return null;
        const entry = inventory.items.find((i) => i._id?.toString() === inventoryItemId);
        if (!entry) return null;
        entry.locked = !entry.locked;
        return inventory.save();
    }
}

export const inventoryService = new InventoryService();
