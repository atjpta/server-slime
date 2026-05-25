import { MasterDataKey } from "@/modules/master-data/enums/master-data.enum.js";
import { MasterDataModel, MasterDataValue } from "@/modules/master-data/models/master-data.model.js";

export class MasterDataService {
    async getAll() {
        return MasterDataModel.find().lean();
    }

    async getByKey(key: MasterDataKey) {
        return MasterDataModel.findOne({ key }).lean();
    }

    async create(key: MasterDataKey, value: MasterDataValue, note?: string) {
        const doc = await MasterDataModel.create({ key, value, note: note ?? "" });
        return doc.toObject();
    }

    async update(key: MasterDataKey, data: { value?: MasterDataValue; note?: string }) {
        return MasterDataModel.findOneAndUpdate({ key }, { $set: data }, { new: true }).lean();
    }

    async delete(key: MasterDataKey) {
        return MasterDataModel.findOneAndDelete({ key }).lean();
    }
}

export const masterDataService = new MasterDataService();
