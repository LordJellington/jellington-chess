import { createStore } from 'redux';
import { chessInvasion } from '../reducers/index';
import { StoreState, GamePhase } from '../types/index';

const store = createStore<StoreState>(chessInvasion, {
    boardStateAtTurnStart: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    gamePhase: GamePhase.TITLE,
    squaresMovedToOnCurrentTurn: '',
    aiPiecesAdded: [],
    roundNumber: 0,
    gameWon: false
});

export default store;