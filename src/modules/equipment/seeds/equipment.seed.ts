import { EquipmentModel } from "@/modules/equipment/models/equipment.model.js";
import { equipmentService } from "@/modules/equipment/services/equipment.service.js";
import { PlayerModel } from "@/modules/player/models/player.model.js";
import { Types } from "mongoose";

export const EquipmentSeed = async () => {
    const players = await PlayerModel.find({}, { _id: 1 }).lean();
    if (!players.length) return;

    const existingEquipments = await EquipmentModel.find(
        { player: { $in: players.map((p) => p._id) } },
        { player: 1 }
    ).lean();

    const existingPlayerIds = new Set(existingEquipments.map((e) => e.player.toString()));

    const playersWithoutEquipment = players.filter(
        (p) => !existingPlayerIds.has((p._id as Types.ObjectId).toString())
    );

    await Promise.all(
        playersWithoutEquipment.map((p) =>
            equipmentService.initPlayerEquipment((p._id as Types.ObjectId).toString())
        )
    );
};
