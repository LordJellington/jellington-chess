import { StoreState, GamePhase } from '../types/index';
import { SET_BOARD_STATE_AT_TURN_START, SET_PHASE, ADD_SQUARE_MOVED_TO, RESET_SQUARES_MOVED_TO_ON_CURRENT_TURN, SET_GAME_WON } from '../constants/index';
import { CommonHelper } from '../helpers/commonhelper';

let setPhase = (state: StoreState, gamePhase: GamePhase): StoreState => {
    state.gamePhase = gamePhase;
    return state;
};

let setBoard = (state: StoreState, boardStateAtTurnStart: string): StoreState => {
    state.boardStateAtTurnStart = boardStateAtTurnStart;
    return state;
};

let addSquareMovedTo = (state: StoreState, squareMovedTo: string): StoreState => {
    let pieces = state.squaresMovedToOnCurrentTurn.split(' ');
    pieces.push(squareMovedTo);
    state.squaresMovedToOnCurrentTurn = pieces.join(' ');
    return state;
};

let resetSquaresMovedToOnCurrentTurn = (state: StoreState): StoreState => {
    state.squaresMovedToOnCurrentTurn = '';
    return state;
};

let setGameWon = (state: StoreState, gameWon: boolean): StoreState => {
    state.gameWon = gameWon;
    return state;
};

export function chessInvasion(state: StoreState, action: any): StoreState {

    let cloneState = CommonHelper.clone(state);

    switch (action.type) {
        case SET_BOARD_STATE_AT_TURN_START:
            cloneState = setBoard(cloneState, action.boardStateAtTurnStart);
            break;
        case SET_PHASE:
            cloneState = setPhase(cloneState, action.gamePhase);
            break;
        case ADD_SQUARE_MOVED_TO:
            cloneState = addSquareMovedTo(cloneState, action.squareMovedTo);
            break;
        case RESET_SQUARES_MOVED_TO_ON_CURRENT_TURN:
            cloneState = resetSquaresMovedToOnCurrentTurn(cloneState);
            break;
        case SET_GAME_WON: 
            cloneState = setGameWon(cloneState, action.gameWon);
            break;
        default:
            break; 
    }

    return cloneState;

}