import { ArraySchema, Schema, type } from "@colyseus/schema";
import { Player } from "@/modules/player/models/player.model.js";
import { BattleItemState } from "@/rooms/battle/schema/battle-item.state.js";

export class BattlePlayerState extends Schema {
    @type("string") playerId: string = "";
    @type("boolean") ready: boolean = false;
    @type(["number"]) actions = new ArraySchema<number>();
    @type([BattleItemState]) offeredItems = new ArraySchema<BattleItemState>();
    @type([BattleItemState]) items = new ArraySchema<BattleItemState>();

    static from(player: Player): BattlePlayerState {
        const p = new BattlePlayerState();
        p.playerId = player._id.toString();
        return p;
    }
}
