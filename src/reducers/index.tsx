import { EnthusiasmAction } from '../actions';
import { StoreState, GamePhase } from '../types/index';
import { INCREMENT_ENTHUSIASM, DECREMENT_ENTHUSIASM, SET_BOARD, SET_PHASE } from '../constants/index';
import { CommonHelper } from '../helpers/commonhelper';

export function enthusiasm(state: StoreState, action: EnthusiasmAction): StoreState {

    switch (action.type) {
        
        case INCREMENT_ENTHUSIASM:
            return { ...state, enthusiasmLevel: state.enthusiasmLevel + 1 };
        case DECREMENT_ENTHUSIASM:
            return { ...state, enthusiasmLevel: Math.max(1, state.enthusiasmLevel - 1) };
        default: 
            return { ...state };

    }

} 

export function chessInvasion(state: StoreState, action: any): StoreState {

    let cloneState = CommonHelper.clone(state);

    switch (action.type) {
        case SET_BOARD:
            cloneState = setBoard(cloneState, action.boardState);
        case SET_PHASE:
            cloneState = setPhase(cloneState, action.gamePhase);
            break;
        default:
            break; 
    }

    return cloneState;

}

let setPhase = (state: StoreState, gamePhase: GamePhase) => {
    state.gamePhase = gamePhase;
    return state;
} 

let setBoard = (state: StoreState, boardState: string) => {
    state.boardState = boardState;
    return state;
}