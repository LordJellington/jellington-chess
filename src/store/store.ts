import { createStore } from 'redux';
import { enthusiasm } from '../reducers/index';
import { StoreState, GamePhase } from '../types/index';

const store = createStore<StoreState>(enthusiasm, {
    enthusiasmLevel: 1,
    languageName: 'TypeScript',
    boardState: null,
    gamePhase: GamePhase.TITLE,
    
});

export default store;