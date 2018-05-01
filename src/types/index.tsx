export enum GamePhase {
    TITLE = 0, 
    INSTRUCTIONS = 1,
    PLACEMENT = 2,
    PLAYER_TURN = 3,
    AI_TURN = 4,
    GAME_OVER = 5 
}

export interface StoreState {
    boardStateAtTurnStart: string | null;
    gamePhase: GamePhase;
    squaresMovedToOnCurrentTurn: string;
    aiPiecesAdded: string[];
    roundNumber: number;
    gameWon: boolean;
    gameMode: string;
}

export interface MoveDetails {
    source: string;
    san: string;
    piece: string;
    targetSquare: string;
    capturesPlayerPiece: string;
    rowDistance: number;
    columnDistance: number;
}

export interface PieceDetail {
    piece: string;
    rating: number;
}