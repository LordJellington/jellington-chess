import store from '../store/store';
import { MoveHelper } from './movehelper';
import { RESET_SQUARES_MOVED_TO_ON_CURRENT_TURN, SET_PHASE, SET_BOARD_STATE_AT_TURN_START, INCREMENT_TURN_NUMBER, ADD_AI_PIECES_MOVED, SET_GAME_WON, ROUNDS_TO_WIN, COLUMNS } 
    from '../constants/index';
import { GamePhase, SpawnChance } from '../types/index';
import { CommonHelper } from './commonhelper';
var ChessBoard = require('chessboardjs');
var Chess = require('chess.js');
declare var $: any;

export class BoardHelper {

    private chess: any;
    private board: any;
    private moveHelper: MoveHelper;

    private spawnChances: SpawnChance[] = [
        {piece: 'q', chance: 0.05},
        {piece: 'n', chance: 0.2},
        {piece: 'r', chance: 0.35},
        {piece: 'b', chance: 0.5},
        {piece: 'p', chance: 1.0}
      ];

    constructor() {
        this.chess = new Chess();
    }

    public start = (): void => {

        let swapPieceColour: boolean = Math.random() < 0.5;

        this.chess = new Chess();
        this.chess.game_over = function () { return false; };
        this.chess.in_check = function () { return false; };
        this.chess.in_checkmate = function () { return false; };
        this.chess.in_draw = function () { return false; };
        this.chess.in_checkmate = function () { return false; };
        this.chess.in_threefold_repetition = function () { return false; };
        this.moveHelper = new MoveHelper(this.chess);
        this.board = ChessBoard('board', {
            draggable: true,
            pieceTheme: (piece: string) => {
                if (swapPieceColour) {
                    piece = (piece.charAt(0) === 'w' ? piece.replace('w', 'b') : piece.replace('b', 'w'));
                }
                return 'assets/pieces/' + piece + '.png';
            },
            onDragStart: this.moveHelper.onDragStart,
            onDrop: this.moveHelper.onDrop,
            onMouseoutSquare: this.moveHelper.onMouseoutSquare,
            onMouseoverSquare: this.moveHelper.onMouseoverSquare,
            showNotation: false
        });
        this.moveHelper.setBoard(this.board);
        this.board.start();

        // apply touchstart event to all squares
        let allSquares: string[] = [];
        for (let i = 0; i < COLUMNS.length; i++) {
            for (let j = 1; j <= 8; j++) {
                allSquares.push('.square-' + COLUMNS[i] + j.toString());
            }
        }
        $(allSquares.join(',')).on('touchstart click', (e: any) => {
            let piece: any = e.target.attributes['data-piece'];
            if (piece) {
                let square: any = e.target.parentElement.attributes['data-square'];
                if (square) {
                    this.moveHelper.onMouseoverSquare(square.nodeValue, piece.nodeValue);
                }
                
            }
        });

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
        
        if (this.isGameOver()) {
            store.dispatch({
                type: SET_PHASE,
                gamePhase: GamePhase.GAME_OVER
            });
        } else {

            this.setAsAITurn();
            this.moveHelper.makeAIMoves();
    
            // synchronise this.board and this.chess
            this.board.position(this.chess.fen());
    
            while (CommonHelper.getPiecesOnBoard('b', this.chess) < 2) {
                this.addAIPieces();
            }

            this.setAsPlayersTurn();
            this.incrementTurnNumber();

        }

    }

    public submitPlacement = (): void => {

        this.setAsAITurn(this.board.fen());
        this.addAIPieces();
        this.setAsPlayersTurn();

    }

    public randomMove = (): void => {
        let moves = this.chess.moves();
        let move = moves[Math.floor(Math.random() * moves.length)];
        this.chess.move(move);
        console.log(this.chess.pgn());
    }

    private incrementTurnNumber = (): void => {
        store.dispatch({
            type: INCREMENT_TURN_NUMBER
        });
    }

    private isGameOver = (): boolean => {

        let roundNumber = store.getState().roundNumber;
        if ((roundNumber + 1) >= ROUNDS_TO_WIN) { 
            
            store.dispatch({
                type: SET_GAME_WON,
                gameWon: true
            });
    
            return true;

        }

        // if an AI piece reaches the bottom of the board, game over
        let bottomRowSquares =  ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'];
        if (bottomRowSquares.some(s => this.chess.get(s) && this.chess.get(s).color === 'b')) {

            store.dispatch({
                type: SET_GAME_WON,
                gameWon: false
            });
    
            return true;

        }

        return false;

    }

    private addAIPieces = (): void => {
    
        let roundNumber: number = store.getState().roundNumber;
        let squareSpawnChance: number = 0.2;
        let numberOfPiecesSpawned: number = 0;

        if (roundNumber >= 10) {
            squareSpawnChance = 0.3;
        }        

        // find all of the squares in the top row that don't have an AI piece in them
        let topRowSquares: string[] = ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'];
        let unoccupiedTopRowSquares: string[] = [];
        for (let i: number = 0; i < topRowSquares.length; i++) {
            if (!this.chess.get(topRowSquares[i]) || this.chess.get(topRowSquares[i]).color === 'w') {
                unoccupiedTopRowSquares.push(topRowSquares[i]);
            }
        }

        // add the pieces to the squares
        for (let j: number = 0; j < unoccupiedTopRowSquares.length; j++) {

            let chanceOfSpawningOnSquare = Math.random();
            
            for (let k: number = 0; k < this.spawnChances.length; k++) {
                let spawnChance: number = this.spawnChances[k].chance * squareSpawnChance;
                let piece: string = this.spawnChances[k].piece;

                if (this.chess.get(unoccupiedTopRowSquares[j]) && this.chess.get(unoccupiedTopRowSquares[j]).color === 'w') {
                    spawnChance *= 2;
                }

                if (chanceOfSpawningOnSquare <= spawnChance) {
                
                    let newPiece: any = {
                        type: piece,
                        color: this.chess.BLACK
                    };
                    
                    // remove player pieces if an AI piece spawns on top of them
                    if (this.chess.get(unoccupiedTopRowSquares[j])) {
                        this.chess.remove(unoccupiedTopRowSquares[j]);
                    }
                    this.chess.put(newPiece, unoccupiedTopRowSquares[j]);
                    
                    // tell the state of the pieces that were added for its log
                    store.dispatch({
                        type: ADD_AI_PIECES_MOVED,
                        pieceAdded: newPiece.type
                    });

                    numberOfPiecesSpawned++;

                    break;
                }

            }         

        }

        if (roundNumber === 0 && numberOfPiecesSpawned === 0) {
            this.addAIPieces();
        }

    }

    private setAsPlayersTurn = (): void => {

        // move back to players turn
        this.moveHelper.setNextTurnTaker('w', false);
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

    private setAsAITurn = (boardFen?: string): void => {
     
        this.moveHelper.setNextTurnTaker('b', false, boardFen);
        store.dispatch({
            type: SET_PHASE,
            gamePhase: GamePhase.AI_TURN
        });

    }

}