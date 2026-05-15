import { ArraySchema, Schema, type } from "@colyseus/schema";
import { Player } from "@/modules/player/models/player.model.js";

export class BattlePlayerState extends Schema {
    @type("string") playerId: string = "";
    @type("boolean") ready: boolean = false;
    @type(["number"]) actions = new ArraySchema<number>();

    static from(player: Player): BattlePlayerState {
        const p = new BattlePlayerState();
        p.playerId = player._id.toString();
        return p;
    }
}
