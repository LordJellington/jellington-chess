export enum GamePhase {
    TITLE = 0, 
    PLACEMENT = 1,
    PLAYER_TURN = 2,
    AI_TURN = 3,
    GAME_OVER = 4 
}

export interface StoreState {
    boardStateAtTurnStart: string | null;
    gamePhase: GamePhase;
    squaresMovedToOnCurrentTurn: string;
}