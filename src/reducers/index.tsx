import { StoreState, GamePhase } from '../types/index';
import { SET_BOARD_STATE_AT_TURN_START, SET_PHASE, ADD_MOVED_PIECE, RESET_PIECES_THAT_HAVE_MOVED_ON_CURRENT_TURN } from '../constants/index';
import { CommonHelper } from '../helpers/commonhelper';

let setPhase = (state: StoreState, gamePhase: GamePhase): StoreState => {
    state.gamePhase = gamePhase;
    return state;
};

let setBoard = (state: StoreState, boardStateAtTurnStart: string): StoreState => {
    state.boardStateAtTurnStart = boardStateAtTurnStart;
    return state;
};

let addMovedPiece = (state: StoreState, pieceThatMoved: string): StoreState => {
    let pieces = state.piecesThatHaveMovedOnCurrentTurn.split(' ');
    pieces.push(pieceThatMoved);
    state.piecesThatHaveMovedOnCurrentTurn = pieces.join(' ');
    return state;
}

let resetPiecesThatHaveMovedOnCurrentTurn = (state: StoreState): StoreState => {
    state.piecesThatHaveMovedOnCurrentTurn = '';
    return state;
}

export function chessInvasion(state: StoreState, action: any): StoreState {

    let cloneState = CommonHelper.clone(state);

    switch (action.type) {
        case SET_BOARD_STATE_AT_TURN_START:
            cloneState = setBoard(cloneState, action.boardStateAtTurnStart);
            break;
        case SET_PHASE:
            cloneState = setPhase(cloneState, action.gamePhase);
            break;
        default:
            break; 
    }

    return cloneState;

}