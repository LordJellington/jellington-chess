import { StoreState, GamePhase } from '../types/index';
import { SET_BOARD, SET_PHASE } from '../constants/index';
import { CommonHelper } from '../helpers/commonhelper';

let setPhase = (state: StoreState, gamePhase: GamePhase) => {
    state.gamePhase = gamePhase;
    return state;
};

let setBoard = (state: StoreState, boardState: string) => {
    state.boardState = boardState;
    return state;
};

export function chessInvasion(state: StoreState, action: any): StoreState {

    let cloneState = CommonHelper.clone(state);

    switch (action.type) {
        case SET_BOARD:
            cloneState = setBoard(cloneState, action.boardState);
            break;
        case SET_PHASE:
            cloneState = setPhase(cloneState, action.gamePhase);
            break;
        default:
            break; 
    }

    return cloneState;

}