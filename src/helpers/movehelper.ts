import store from '../store/store';
import { GamePhase, MoveDetails } from '../types/index';
import { ADD_SQUARE_MOVED_TO, COLUMNS } from '../constants/index';

declare var $: any;

export class MoveHelper {

  private board: any;
  private game: any;
  private possiblePlayerMoveDetails: MoveDetails[];

  public constructor(game: any) {
    this.game = game;
    this.possiblePlayerMoveDetails = [];
  }

  setBoard = (board: any) => {
    this.board = board;
  }

  // see http://chessboardjs.com/examples#5003

  removeGreySquares = () => {
    $('#board .square-55d63').css('background', '');
  }

  greySquare = (square: any) => {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
      background = '#696969';
    }

    squareEl.css('background', background);
  }

  invalidMove = (source: any, piece: any, target?: any): boolean => {
    
    let { gamePhase, squaresMovedToOnCurrentTurn } = store.getState();
    
    if (gamePhase === GamePhase.PLAYER_TURN) {

      return !piece || 
      (gamePhase !== GamePhase.PLAYER_TURN && gamePhase !== GamePhase.PLACEMENT) ||
      this.game.game_over() === true ||
      (this.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (this.game.turn() === 'b' && piece.search(/^w/) !== -1) ||
      squaresMovedToOnCurrentTurn.indexOf(source) >= 0;

    } else if (gamePhase === GamePhase.PLACEMENT) {

      return +target.charAt(1) > 2 || // target is not in first two rows
        !!this.game.get(target); // there is a piece occupying the target square

    }

    return true;

    // a piece cannot move if:
    // the game is over
    // it's not the player's turn
    // that piece has moved before on the current turn

  }

  onDragStart = (source: any, piece: any) => {

    let { gamePhase } = store.getState();

    if (gamePhase === GamePhase.PLAYER_TURN && this.invalidMove(source, piece)) {
      return false;
    }

    return true;
  }

  onDrop = (source: any, target: any) => {
    
    let { gamePhase } = store.getState();
    
    this.removeGreySquares();

    if (gamePhase === GamePhase.PLAYER_TURN) {
      // see if the move is legal
      if (!this.possiblePlayerMoveDetails.some((m: MoveDetails) => m.source === source && m.targetSquare === target)) {
        return 'snapback';
      }

      this.board.move(source + '-' + target);
      store.dispatch({
        type: ADD_SQUARE_MOVED_TO,
        squareMovedTo: target
      });

    } else if (gamePhase === GamePhase.PLACEMENT) {
      
      if (this.invalidMove(source, null, target)) {

        return 'snapback';

      } else {

        this.board.move(source, target);

      }

    }

    this.setNextTurnTaker('w', false, this.board.fen());
    return '';

  }

  setBoardPosition = (newBoardPosition: string) => {
    let fenArray: string[] = this.game.fen().split(' ');
    fenArray[0] = newBoardPosition;
    let newFen: string = fenArray.join(' ');
    this.game.load(newFen);
    this.board.position(newFen, false);
  }

  setNextTurnTaker = (nextTurnTaker: string, animate: boolean, boardFen?: string) => {
    let fenArray: string[] = this.game.fen().split(' ');
    if (boardFen) {
      fenArray[0] = boardFen;
    }
    fenArray[1] = nextTurnTaker; // keep it as white's move
    fenArray[3] = '-'; // no en passant
    fenArray[4] = '0';
    fenArray[5] = '1';
    let newFen: string = fenArray.join(' ');
    this.game.load(newFen);
    this.board.position(newFen, animate);
  }

  onMouseoverSquare = (square: any, piece: any) => {

    let { gamePhase } = store.getState();

    if (gamePhase === GamePhase.PLAYER_TURN) {

      // get list of possible moves for this square
      let moves = this.invalidMove(square, piece) ? [] : 
        this.game.moves({
          square: square,
          verbose: true,
          legal: false
        });

      this.possiblePlayerMoveDetails = moves.map((m: any) => {
        return this.getMoveDetails(square, m);
      });

      // exit if there are no moves available for this square
      if (moves.length === 0) {
        return;
      }

      // highlight the square they moused over
      this.greySquare(square);

      // highlight the possible squares for this piece
      for (var i = 0; i < moves.length; i++) {
        this.greySquare(moves[i].to);
      }

    } else if (gamePhase === GamePhase.PLACEMENT) {

      // exit if mouseovered square is not occupied
      if (!this.game.get(square)) {
        return;
      }
      
      let rows: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      for (let j: number = 0; j < rows.length; j++) {
        for (let k: number = 1; k <= 2; k++) {
          let target: string = rows[j] + k.toString();
          if (!this.game.get(target)) {
            this.greySquare(target);
          }
        }
      }

    }
  }

  onMouseoutSquare = (square: any, piece: any) => {
    this.removeGreySquares();
  }

  onChange = (oldPosition: any, newPosition: any) => {

    console.log('onChange', oldPosition, newPosition);

  }

  getMoveDetails = (source: string, target: any): MoveDetails => {

    let targetSquare: string = target.to;
    
    return {
      source: source,
      piece: this.game.get(source).type,
      san: target.san,
      targetSquare: targetSquare,
      capturesPlayerPiece: this.game.get(targetSquare),
      columnDistance: Math.abs(COLUMNS.indexOf(source.charAt(0).toString()) - COLUMNS.indexOf(targetSquare.charAt(0).toString())),
      rowDistance: ((+source.charAt(1)) - (+targetSquare.charAt(1)))
    };

  }

  selectMove = (source: string, possibleMoves: any[]): MoveDetails | null => {

    // get move details
    let moveList: MoveDetails[] = possibleMoves.map((m: any) => {
      return this.getMoveDetails(source, m);
    });

    // remove those that are too long for this game (i.e. greater than 4 spaces)
    moveList = moveList.filter(m => m.rowDistance <= 4);

    // remove any pawn moves that are greater than 1 rowDistance or 0 columnDistance (as we are ignoring enpassant)
    moveList = moveList.filter(m => {
      if (m.piece === 'p') {
        if (m.rowDistance > 1) {
          return false;
        }
        if (m.capturesPlayerPiece && m.columnDistance === 0) {
          return false;
        }
      }      
      return true;
    });

    // if any remaining move can capture a piece, then use that
    let captureMoves: MoveDetails[] = moveList.filter(m => !!m.capturesPlayerPiece);
    
    if (captureMoves.length) {
      return captureMoves[Math.floor(Math.random() * captureMoves.length)];
    }

    // otherwise use a random move that sends the piece the most rows up the board
    for (let dist: number = 4; dist > 0; dist--) {
      let distMoves: MoveDetails[] = moveList.filter(m => m.rowDistance === dist);
      if (distMoves.length) {
        return distMoves[Math.floor(Math.random() * distMoves.length)];
      }
    }

    // if we still haven't returned anything then return a random move
    return moveList.length ? moveList[Math.floor(Math.random() * moveList.length)] : null;

  }

  makeAIMoves = () => {

    let invalidTargetSquares: string[] = [];

    // check possible moves for each AI piece    
    for (let i = 0; i < COLUMNS.length; i++) {
      
      for (let j = 2; j <= 8; j++) { // exclude row 1, because the game will end if AI reaches there
      
        let square: string = COLUMNS[i] + j.toString();        

        if (this.game.get(square) && this.game.get(square).color === 'b' && invalidTargetSquares.indexOf(square) < 0) {
      
          let possibleMoves: any[] = this.game.moves({square: square, verbose: true, legal: false});
          // make a move for each AI piece
          if (possibleMoves && possibleMoves.length) {
      
            let selectedMove: MoveDetails | null = this.selectMove(square, possibleMoves);        

            if (selectedMove) {
              invalidTargetSquares.push(selectedMove.targetSquare);
              this.game.move(selectedMove.san);
              this.setNextTurnTaker('b', true);
            }
      
          }
        }
      
      }

    }

  }

}