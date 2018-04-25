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
    aiPiecesAdded: string[];
    roundNumber: number;
}

export interface MoveDetails {
    source: string;
    target: string;
    piece: string;
    targetSquare: string;
    capturesPlayerPiece: string;
    rowDistance: number;
    columnDistance: number;
}

export interface SpawnChance {
    piece: string;
    chance: number;
}