import store from '../store/store';
import { MoveHelper } from './movehelper';
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
    }

    public resetTurn = (): void => {
        // TODO: dispatch action to clear piecesThatHaveMoved
        
        let boardStateAtTurnStart: string | null = store.getState().boardStateAtTurnStart;    
        this.chess.load(boardStateAtTurnStart);
        this.board.position(boardStateAtTurnStart);
    }

    public submitTurn = (): void => {
        // TODO: dispatch submit turn action
        console.log('submit turn');

        // TODO: call handler for AI's turn
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