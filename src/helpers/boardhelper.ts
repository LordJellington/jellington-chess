import store from '../store/store';
import { MoveHelper } from './movehelper';
import { RESET_SQUARES_MOVED_TO_ON_CURRENT_TURN, SET_PHASE, SET_BOARD_STATE_AT_TURN_START, INCREMENT_TURN_NUMBER, ADD_AI_PIECES_MOVED, SET_GAME_WON, ROUNDS_TO_WIN, COLUMNS, RESET_TURN_NUMBER, SET_GAME_MODE } 
    from '../constants/index';
import { GamePhase, PieceDetail } from '../types/index';
import { CommonHelper } from './commonhelper';
var ChessBoard = require('chessboardjs');
var Chess = require('chess.js');
declare var $: any;

export class BoardHelper {

    private chess: any;
    private board: any;
    private moveHelper: MoveHelper;

    private pieceDetails: PieceDetail[] = [
        {piece: 'q', rating: 4},
        {piece: 'n', rating: 3},
        {piece: 'r', rating: 2.5},
        {piece: 'b', rating: 2},
        {piece: 'p', rating: 1}
      ];

    constructor() {
        this.chess = new Chess();
    }

    public start = (): void => {

        store.dispatch({
            type: RESET_TURN_NUMBER
        });

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
                    piece = (piece.charAt(0) === 'w' ? 'b' + piece.charAt(1) : 'w' + piece.charAt(1));
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

        // look at if both touchstart and click are needed here. Perhaps just touchstart is
        $(allSquares.join(',')).on('touchstart', (e: any) => {
            e.preventDefault();
            let piece: any = e.target.attributes['data-piece'];
            if (piece) {
                let square: any = e.target.parentElement.attributes['data-square'];
                if (square) {
                    this.moveHelper.onMouseoverSquare(square.nodeValue, piece.nodeValue);
                }
            }
            return true;
        });

        this.setInitialBoardState();
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
            this.moveHelper.makeAIMoves(() => {

                // synchronise this.board and this.chess
                this.board.position(this.chess.fen());
        
                this.addAIPieces();

                this.setAsPlayersTurn();
                this.incrementTurnNumber();

            });

        }

    }

    public submitPlacement = (): void => {

        this.setAsAITurn(this.board.fen());
        this.addAIPieces(true);
        this.setAsPlayersTurn();

    }

    public setGameMode = (selectElementId: string): void => {
        let inputElement = (document.getElementById(selectElementId) as HTMLSelectElement);
        let selectedIndex = inputElement.selectedIndex;
        let option = inputElement.options.item(selectedIndex);
        let value = option.value;
        store.dispatch({
            type: SET_GAME_MODE,
            gameMode: value
        });

        this.setInitialBoardState();
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

    private addAIPieces = (addPiecesAnyway?: boolean): void => {
        let roundNumber: number = store.getState().roundNumber;
 
        // only add AI pieces every 2 turns
        if (roundNumber % 2 === 0 && !addPiecesAnyway) {
            return;
        }
        
        let pieceValueUpperThreshold: number = Math.round(4 + ((roundNumber + 1) * 0.4));
        let pieceValueLowerThreshold: number = Math.round(pieceValueUpperThreshold / 2);

        // find all of the squares in the top row that don't have an AI piece in them
        let topRowSquares: string[] = ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'];
        let unoccupiedTopRowSquares: string[] = [];
        for (let i: number = 0; i < topRowSquares.length; i++) {
            if (!this.chess.get(topRowSquares[i]) || this.chess.get(topRowSquares[i]).color === 'w') {
                unoccupiedTopRowSquares.push(topRowSquares[i]);
            }
        }

        let loopCounter: number = 0; 
        let piecesToSpawn: PieceDetail[] = this.getPiecesToSpawn();
        let totalRating: number = piecesToSpawn.map(p => p.rating).reduce((acc, v) => acc + v);
        while (!(totalRating > pieceValueLowerThreshold && totalRating < pieceValueUpperThreshold) && loopCounter < 10000) {
            piecesToSpawn = this.getPiecesToSpawn();
            totalRating = piecesToSpawn.map(p => p.rating).reduce((acc, v) => acc + v);
            loopCounter++;
        } 
        
        if (loopCounter === 10000) {
            return;
        }
         
        // if there are more pieces than squares
        if (piecesToSpawn.length > unoccupiedTopRowSquares.length) {
            piecesToSpawn = piecesToSpawn.splice(0, unoccupiedTopRowSquares.length);
        }

        // spawn the pieces
        for (let j: number = 0; j < piecesToSpawn.length; j++) {
            
            let newPiece: any = {
                type: piecesToSpawn[j].piece,
                color: this.chess.BLACK
            };

            // if a top row square contains a white piece, then 50% chance that is used as the spawn square
            let playerOccupiedSquare: string = '';
            for (let i: number = 0; i < unoccupiedTopRowSquares.length; i++) {
                let square = unoccupiedTopRowSquares[i];
                if (this.chess.get(square) && Math.random() >= 0.5) {
                    playerOccupiedSquare = square;
                }
            }

            let spawnSquare: string = playerOccupiedSquare.length ? playerOccupiedSquare : CommonHelper.getRandomElement(unoccupiedTopRowSquares);
            
            if (this.chess.get(spawnSquare)) {
                this.chess.remove(spawnSquare);
            }
            this.chess.put(newPiece, spawnSquare);

            unoccupiedTopRowSquares = unoccupiedTopRowSquares.filter(s => s !== spawnSquare);
            
            // tell the state of the pieces that were added for its log
            store.dispatch({
                type: ADD_AI_PIECES_MOVED,
                pieceAdded: newPiece.type
            });

        }
        
    }

    private getPiecesToSpawn = (): PieceDetail[] => {

        let piecesToSpawn: PieceDetail[] = [];
        let numberOfPiecesToSpawn: number = 2 + (2 * Math.random());
        for (let i: number = 0; i < numberOfPiecesToSpawn; i++) {
            piecesToSpawn.push(CommonHelper.getRandomElement(this.pieceDetails));
        }

        return piecesToSpawn;

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

    private setInitialBoardState = (): void => {
        this.chess.load('8/8/8/8/8/8/8/8 w - - 0 1'); // empty board
        this.board.position(this.chess.fen());

        let gameMode: string = store.getState().gameMode;

        // set initial board state
        if (gameMode === 'normal') {
            this.chess.put({ type: this.chess.BISHOP, color: this.chess.WHITE }, 'c1');
            this.chess.put({ type: this.chess.KNIGHT, color: this.chess.WHITE }, 'd1');
            this.chess.put({ type: this.chess.QUEEN, color: this.chess.WHITE }, 'e1');
            this.chess.put({ type: this.chess.ROOK, color: this.chess.WHITE }, 'f1');
        } else if (gameMode === 'harder') {
            this.chess.put({ type: this.chess.KNIGHT, color: this.chess.WHITE }, 'd1');
            this.chess.put({ type: this.chess.QUEEN, color: this.chess.WHITE }, 'e1');
            this.chess.put({ type: this.chess.ROOK, color: this.chess.WHITE }, 'f1');
        } else if (gameMode === 'horsies') {
            this.chess.put({ type: this.chess.KNIGHT, color: this.chess.WHITE }, 'c1');
            this.chess.put({ type: this.chess.KNIGHT, color: this.chess.WHITE }, 'd1');
            this.chess.put({ type: this.chess.KNIGHT, color: this.chess.WHITE }, 'e1');
            this.chess.put({ type: this.chess.KNIGHT, color: this.chess.WHITE }, 'f1');
        }      

        this.board.position(this.chess.fen());
    }
}