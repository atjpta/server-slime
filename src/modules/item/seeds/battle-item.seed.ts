import { BattleItemCode, BattleItemType } from "@/modules/item/enums/battle-item.enum.js";
import { BattleItemModel, BattleItemStatus } from "@/modules/item/models/battle-item.model.js";
import { BattlePhaseEnum } from "@/rooms/battle/enums/battle.enum.js";

export const BattleItemSeed = async () => {
    const items = [
        {
            code: BattleItemCode.HEAL_001,
            type: BattleItemType.BUFF,
            status: BattleItemStatus.ACTIVE,
            weight: 10,
            note: "hồi máu",
            rule: { phase: BattlePhaseEnum.SELECTING, scale: { hp: 0.2 } },
        },
        {
            code: BattleItemCode.DAMAGE_001,
            type: BattleItemType.BUFF,
            status: BattleItemStatus.ACTIVE,
            weight: 10,
            note: "tăng damage",
            rule: { phase: BattlePhaseEnum.SELECTING, scale: { damage: 2 } },
        },
        // {
        //     code: "insight-001",
        //     type: BattleItemType.INFO,
        //     status: BattleItemStatus.INACTIVE,
        //     note: "Nhìn 1 action và chỉnh lại action",
        //     rule: { phase: BattlePhaseEnum.PRE_EXECUTING },
        // },
        // {
        //     code: "insight-002",
        //     type: BattleItemType.INFO,
        //     status: BattleItemStatus.INACTIVE,
        //     note: "hight light 3 action liên tục giống nhau",
        //     rule: { phase: BattlePhaseEnum.PRE_EXECUTING },
        // },
        // {
        //     code: "insight-003",
        //     type: BattleItemType.INFO,
        //     status: BattleItemStatus.INACTIVE,
        //     note: "hight light action có type nhiều nhất",
        //     rule: { phase: BattlePhaseEnum.PRE_EXECUTING },
        // },
        // {
        //     code: "fake-intent-001",
        //     type: BattleItemType.BLUFF,
        //     status: BattleItemStatus.INACTIVE,
        //     note: "nếu đối phương dùng BattleItemType.INFO, sẽ trả về data giả",
        //     rule: { phase: BattlePhaseEnum.PRE_EXECUTING },
        // },
        // {
        //     code: BattleItemCode.MIRROR_001,
        //     type: BattleItemType.BLUFF,
        //     status: BattleItemStatus.ACTIVE,
        //     note: "copy và dùng vật phẩm của đối phương đang dùng trong wave hiện tại",
        //     rule: { phase: BattlePhaseEnum.PRE_EXECUTING },
        // },
        {
            code: BattleItemCode.PUSH_001,
            type: BattleItemType.TEMPO,
            status: BattleItemStatus.ACTIVE,
            weight: 7,
            note: "làm action của đối phương tịnh tiến 1 lần",
            rule: { phase: BattlePhaseEnum.SELECTING },
        },
        {
            code: BattleItemCode.SHUFFLE_001,
            type: BattleItemType.TEMPO,
            status: BattleItemStatus.ACTIVE,
            weight: 5,
            note: "xáo trộn các hành động đang có",
            rule: { phase: BattlePhaseEnum.SELECTING },
        },
        {
            code: BattleItemCode.STORM_001,
            type: BattleItemType.CHAOS,
            status: BattleItemStatus.ACTIVE,
            weight: 3,
            note: "xáo trộn các hành động của cả 2 bên",
            rule: { phase: BattlePhaseEnum.SELECTING },
        },
    ];

    await BattleItemModel.bulkWrite(
        items.map((item) => ({
            updateOne: {
                filter: { code: item.code },
                update: { $set: item },
                upsert: true,
            },
        }))
    );
};
