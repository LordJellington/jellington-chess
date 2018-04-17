import { createStore } from 'redux';
import { chessInvasion } from '../reducers/index';
import { StoreState, GamePhase } from '../types/index';

const store = createStore<StoreState>(chessInvasion, {
    boardState: null,
    gamePhase: GamePhase.TITLE,
    
});

export default store;