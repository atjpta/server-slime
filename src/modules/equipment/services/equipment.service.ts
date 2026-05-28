import { EquipmentSlot, ItemCode, ItemRarity, ItemSource } from "@/modules/item/enums/item.enum.js";
import { EquipmentModel, IEquipment } from "@/modules/equipment/models/equipment.model.js";
import { ItemModel } from "@/modules/item/models/item.model.js";

export interface EquipItemDto {
    slot: EquipmentSlot;
    item: string;
    rarity: ItemRarity;
    source: ItemSource;
    metadata?: Record<string, unknown>;
}

const DEFAULT_EQUIPMENT: { slot: EquipmentSlot; code: ItemCode }[] = [
    { slot: EquipmentSlot.ATTACK, code: ItemCode.SWORD_001 },
    { slot: EquipmentSlot.MAGIC, code: ItemCode.MAGIC_STAFF_001 },
    { slot: EquipmentSlot.SHIELD, code: ItemCode.WOODEN_SHIELD_001 },
];

export class EquipmentService {
    async getByPlayerId(playerId: string): Promise<IEquipment | null> {
        return EquipmentModel.findOne({ player: playerId })
            .populate(Object.values(EquipmentSlot).map((s) => `${s}.item`).join(" "))
            .lean();
    }

    async initPlayerEquipment(playerId: string): Promise<IEquipment> {
        const defaultItems = await ItemModel.find(
            { code: { $in: DEFAULT_EQUIPMENT.map((d) => d.code) } },
            { _id: 1, code: 1, rarity: 1 }
        ).lean();

        const slotData = DEFAULT_EQUIPMENT.reduce(
            (acc, { slot, code }) => {
                const item = defaultItems.find((i) => i.code === code);
                if (item) {
                    acc[slot] = {
                        item: item._id,
                        rarity: item.rarity,
                        source: ItemSource.SYSTEM,
                        locked: false,
                        metadata: {},
                    };
                }
                return acc;
            },
            {} as Record<string, unknown>
        );

        return EquipmentModel.findOneAndUpdate(
            { player: playerId },
            { $setOnInsert: { player: playerId, ...slotData } },
            { returnDocument: "after", upsert: true }
        ) as Promise<IEquipment>;
    }

    async equip(playerId: string, dto: EquipItemDto): Promise<IEquipment | null> {
        const { slot, ...slotData } = dto;
        return EquipmentModel.findOneAndUpdate(
            { player: playerId },
            { $set: { [slot]: slotData } },
            { returnDocument: "after", upsert: true }
        ).lean();
    }

    async unequip(playerId: string, slot: EquipmentSlot): Promise<IEquipment | null> {
        return EquipmentModel.findOneAndUpdate(
            { player: playerId },
            { $set: { [slot]: null } },
            { returnDocument: "after" }
        ).lean();
    }

    async toggleLock(playerId: string, slot: EquipmentSlot): Promise<IEquipment | null> {
        const equipment = await EquipmentModel.findOne({ player: playerId });
        if (!equipment) return null;
        const current = equipment[slot];
        if (!current) return null;
        current.locked = !current.locked;
        return equipment.save();
    }
}

export const equipmentService = new EquipmentService();
