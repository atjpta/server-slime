import { MapSchema, Schema, type } from "@colyseus/schema";
import { BattlePhaseEnum } from "@/rooms/battle/enums/battle.enum.js";
import { BattlePlayerState } from "@/rooms/battle/schema/player.battle.state.js";

export class BattleState extends Schema {
    @type("string") phase: string = BattlePhaseEnum.WAITING;
    @type("number") wave: number = 0;
    @type("number") timeLeft: number = 0;
    @type({ map: BattlePlayerState }) players = new MapSchema<BattlePlayerState>();
    @type("string") winner: string = "";
}
