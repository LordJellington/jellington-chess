import store from '../store/store';
import { MoveHelper } from './movehelper';
import { RESET_SQUARES_MOVED_TO_ON_CURRENT_TURN, SET_PHASE, SET_BOARD_STATE_AT_TURN_START } from '../constants/index';
import { GamePhase } from '../types/index';
var ChessBoard = require('chessboardjs');
var Chess = require('chess.js');

export class BoardHelper {

    private chess: any;
    private board: any;
    private moveHelper: MoveHelper;

    constructor() {
        this.chess = new Chess();
    }

    public start = (): void => {
        this.chess = new Chess();

        this.moveHelper = new MoveHelper(this.chess);
        this.board = ChessBoard('board', {
            draggable: true,
            pieceTheme: 'assets/pieces/{piece}.png',
            onDragStart: this.moveHelper.onDragStart,
            onDrop: this.moveHelper.onDrop,
            onMouseoutSquare: this.moveHelper.onMouseoutSquare,
            onMouseoverSquare: this.moveHelper.onMouseoverSquare,
            onSnapEnd: this.moveHelper.onSnapEnd,
            onChange: this.moveHelper.onChange
        });
        this.moveHelper.setBoard(this.board);
        this.board.start();

        this.chess.load('8/8/8/8/8/8/8/8 w - - 0 1'); // empty board
        this.board.position(this.chess.fen());

        // set initial board state
        this.chess.put({ type: this.chess.BISHOP, color: this.chess.WHITE }, 'c1');
        this.chess.put({ type: this.chess.KNIGHT, color: this.chess.WHITE }, 'd1');
        this.chess.put({ type: this.chess.QUEEN, color: this.chess.WHITE }, 'e1');
        this.chess.put({ type: this.chess.ROOK, color: this.chess.WHITE }, 'f1');
        this.board.position(this.chess.fen());
    }

    public resetTurn = (): void => {

        store.dispatch({
            type: RESET_SQUARES_MOVED_TO_ON_CURRENT_TURN
        });
        
        let boardStateAtTurnStart: string | null = store.getState().boardStateAtTurnStart;    
        this.chess.load(boardStateAtTurnStart);
        this.board.position(boardStateAtTurnStart);

    }

    public submitTurn = (): void => {
        
        this.moveHelper.setNextTurnTaker('b');
        store.dispatch({
            type: SET_PHASE,
            gamePhase: GamePhase.AI_TURN
        });
        this.moveHelper.makeAIMoves();

        // move back to players turn
        this.moveHelper.setNextTurnTaker('w');
        store.dispatch({
            type: SET_PHASE,
            gamePhase: GamePhase.PLAYER_TURN
        });
        store.dispatch({
            type: RESET_SQUARES_MOVED_TO_ON_CURRENT_TURN
        });
        store.dispatch({
            type: SET_BOARD_STATE_AT_TURN_START,
            boardStateAtTurnStart: this.chess.fen()
        });

    }

    public randomMove = (): void => {
        let moves = this.chess.moves();
        let move = moves[Math.floor(Math.random() * moves.length)];
        this.chess.move(move);
        console.log(this.chess.pgn());
    }

    public setPosition = (): void => {
        this.board.position(
            {
            d6: 'bK',
            d4: 'wP',
            e4: 'wK'
            }, 
            true
        );
    }

}