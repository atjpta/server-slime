import { ArraySchema, Schema, type } from "@colyseus/schema";
import { BattleItem } from "@/modules/item/models/battle-item.model.js";

export class BattleItemScaleState extends Schema {
    @type("number") hp: number = 0;
    @type("number") damage: number = 0;
}

export class BattleItemRuleState extends Schema {
    @type("string") phase: string = "";
    @type(BattleItemScaleState) scale = new BattleItemScaleState();
}

export class BattleItemState extends Schema {
    @type("string") code: string = "";
    @type("string") type: string = "";
    @type("string") status: string = "";
    @type(BattleItemRuleState) rule = new BattleItemRuleState();

    static from(item: BattleItem): BattleItemState {
        const s = new BattleItemState();
        s.code = item.code;
        s.type = item.type;
        s.status = item.status;
        s.rule.phase = item.rule?.phase ?? "";
        s.rule.scale.hp = item.rule?.scale?.hp ?? 0;
        s.rule.scale.damage = item.rule?.scale?.damage ?? 0;
        return s;
    }

    static fromArray(items: BattleItem[]): ArraySchema<BattleItemState> {
        const arr = new ArraySchema<BattleItemState>();
        for (const item of items) arr.push(BattleItemState.from(item));
        return arr;
    }
}
