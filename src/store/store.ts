import { createStore } from 'redux';
import { chessInvasion } from '../reducers/index';
import { StoreState, GamePhase } from '../types/index';

const store = createStore<StoreState>(chessInvasion, {
    boardStateAtTurnStart: null,
    gamePhase: GamePhase.TITLE,
    piecesThatHaveMovedOnCurrentTurn: ''
});

export default store;