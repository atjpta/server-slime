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
    SUBMIT_EXECUTING_DONE = "submit_executing_done",
    SUBMIT_ACTIONS_BATTLE = "submit_actions_battle",
}

export enum BattleTimerEnum {
    SELECTION_TIMER = "selectionTimer",
    SELECTION_TICKER = "selectionTicker",
    EXECUTING_DONE_TIMER = "executingDoneTimer",
}
