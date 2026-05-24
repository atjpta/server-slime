export enum BattlePhaseEnum {
    WAITING = "waiting",
    SELECTING = "selecting",
    SELECTING_ITEM = "selecting_item",
    PRE_EXECUTING = "pre_executing",
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
    SUBMIT_SELECT_ITEM = "submit_select_item",
}

export enum BattleTimerEnum {
    SELECTION_TIMER = "selection_timer",
    SELECTION_TICKER = "selection_ticker",
    EXECUTING_DONE_TIMER = "executing_done_timer",
    SELECTION_ITEM_TIMER = "selection_item_timer",
    SELECTION_ITEM_TICKER = "selection_item_ticker",
}
