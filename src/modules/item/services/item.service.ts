import { IItem, ItemModel } from "@/modules/item/models/item.model.js";
import { ItemRarity, ItemType } from "@/modules/item/enums/item.enum.js";

export interface CreateItemDto {
    code: string;
    type: ItemType;
    rarity: ItemRarity;
    stackable: boolean;
    sellPrice: number;
    metadata: Record<string, unknown>;
}

export interface UpdateItemDto {
    type?: ItemType;
    rarity?: ItemRarity;
    stackable?: boolean;
    sellPrice?: number;
    metadata?: Record<string, unknown>;
}

export class ItemService {
    async index(): Promise<IItem[]> {
        return ItemModel.find().lean();
    }

    async getById(id: string): Promise<IItem | null> {
        return ItemModel.findById(id).lean();
    }

    async create(dto: CreateItemDto): Promise<IItem> {
        const item = new ItemModel(dto);
        return item.save();
    }

    async update(id: string, dto: UpdateItemDto): Promise<IItem | null> {
        return ItemModel.findByIdAndUpdate(id, { $set: dto }, { returnDocument: "after" }).lean();
    }

    async delete(id: string): Promise<IItem | null> {
        return ItemModel.findByIdAndDelete(id).lean();
    }
}

export const itemService = new ItemService();
