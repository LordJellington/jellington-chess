import store from '../store/store';
import { MoveHelper } from './movehelper';
import { RESET_SQUARES_MOVED_TO_ON_CURRENT_TURN, SET_PHASE, SET_BOARD_STATE_AT_TURN_START, INCREMENT_TURN_NUMBER, ADD_AI_PIECES_MOVED } from '../constants/index';
import { GamePhase, SpawnChance } from '../types/index';
var ChessBoard = require('chessboardjs');
var Chess = require('chess.js');

export class BoardHelper {

    private chess: any;
    private board: any;
    private moveHelper: MoveHelper;

    private spawnChances: SpawnChance[] = [
        {piece: 'q', chance: 0.1},
        {piece: 'n', chance: 0.3},
        {piece: 'r', chance: 0.52},
        {piece: 'b', chance: 0.75},
        {piece: 'p', chance: 1.0}
      ];

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
        
        this.setAsAITurn();
        this.moveHelper.makeAIMoves();

        // TODO: synchronise this.board and this.chess

        this.addAIPieces();
        this.setAsPlayersTurn();
        this.incrementTurnNumber();

    }

    public submitPlacement = (): void => {

        this.setAsAITurn();
        this.addAIPieces();
        this.setAsPlayersTurn();
        this.incrementTurnNumber();

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

    private incrementTurnNumber = (): void => {
        store.dispatch({
            type: INCREMENT_TURN_NUMBER
        });
    }

    private addAIPieces = (): void => {
    
        let roundNumber = store.getState().roundNumber;

        // determine the number of AI pieces to add to the board (e.g. 4 pieces on turn 1, then vary it after that)
        let piecesToSpawn: number = 2;
        if (roundNumber === 1) {
            piecesToSpawn = 4;
        }

        // find all of the squares in the top row that don't have an AI piece in them
        let topRowSquares: string[] = ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'];
        let unoccupiedTopRowSquares: string[] = [];
        for (let i: number = 0; i < topRowSquares.length; i++) {
            if (!this.chess.get(topRowSquares[i]) || this.chess.get(topRowSquares[i]).color === 'b') {
                unoccupiedTopRowSquares.push(topRowSquares[i]);
            }
        }

        // add the pieces to the squares
        let spawnChance: number = piecesToSpawn / unoccupiedTopRowSquares.length;
        console.log(this.spawnChances);

        for (let j: number = 0; j < unoccupiedTopRowSquares.length; j++) {
            
            if (Math.random() <= spawnChance) {
                
                let newPiece: any = {
                    type: this.chess.PAWN,
                    color: this.chess.BLACK
                };
                
                this.chess.put(newPiece, unoccupiedTopRowSquares[j]);
                
                // tell the state of the pieces that were added for its log
                store.dispatch({
                    type: ADD_AI_PIECES_MOVED,
                    pieceAdded: newPiece.type
                });
            }

        }

    }

    private setAsPlayersTurn = (): void => {

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

    private setAsAITurn = (): void => {
     
        this.moveHelper.setNextTurnTaker('b');
        store.dispatch({
            type: SET_PHASE,
            gamePhase: GamePhase.AI_TURN
        });

    }

}