// import store from '../store/store'; TODO: reinstate when I need it
var ChessBoard = require('chessboardjs');

export class BoardHelper {

    private chess: any;
    private board: any;

    constructor() {
        var Chess = require('chess.js');
        this.chess = new Chess();
    }

    public start = (): void => {
        this.board.start();
    }

    public randomMove = (): void => {
        let moves = this.chess.moves();
        let move = moves[Math.floor(Math.random() * moves.length)];
        this.chess.move(move);
        console.log(this.chess.pgn());
    }

    public setupBoard = (): void => {
        this.board = ChessBoard('board', {
            draggable: true,
            pieceTheme: 'assets/pieces/{piece}.png'
        });
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