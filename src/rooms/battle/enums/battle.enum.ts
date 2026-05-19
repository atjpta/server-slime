export enum BattlePhaseEnum {
    WAITING = "waiting",
    SELECTING = "selecting",
    EXECUTING = "executing",
    ENDED = "ended",
}

export enum BattleResultEnum {
    WIN = "win",
    LOSE = "lose",
    DRAW = "draw",
}

export enum BattleEndReasonEnum {
    HP_DEPLETED = "hp_depleted",
    MAX_WAVES = "max_waves",
    DRAW = "draw",
}

export enum BattleEventEnum {
    BATTLE_INIT = "battle_init",
    BATTLE_LOG = "battle_log",
    RANK_UPDATE = "rank_update",
}
