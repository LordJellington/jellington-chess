import store from '../store/store';
import { GamePhase } from '../types/index';
import { ADD_SQUARE_MOVED_TO } from '../constants/index';

declare var $: any;

export class MoveHelper {

  private board: any;
  private game: any;

  public constructor(game: any) {
    this.game = game;
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
      var move = this.game.move({
        from: source,
        to: target,
      });

      // illegal move
      if (move === null) {
        return 'snapback';
      }

      this.board.move(source, target);
      store.dispatch({
        type: ADD_SQUARE_MOVED_TO,
        squareMovedTo: target
      });
  
      this.setNextTurnTaker('w');

      return '';

    } else if (gamePhase === GamePhase.PLACEMENT) {
      
      if (this.invalidMove(source, null, target)) {

        return 'snapback';

      } else {

        this.board.move(source, target);
        return '';

      }

    }

    return '';

  }

  setBoardPosition = (newBoardPosition: string) => {
    let fenArray: string[] = this.game.fen().split(' ');
    fenArray[0] = newBoardPosition;
    let newFen: string = fenArray.join(' ');
    this.game.load(newFen);
    this.board.position(newFen, false);
  }

  setNextTurnTaker = (nextTurnTaker: string) => {
    let fenArray: string[] = this.game.fen().split(' ');
    fenArray[1] = nextTurnTaker; // keep it as white's move
    fenArray[3] = '-'; // no en passant
    let newFen: string = fenArray.join(' ');
    this.game.load(newFen);
    this.board.position(newFen, false);
  }

  onMouseoverSquare = (square: any, piece: any) => {

    let { gamePhase } = store.getState();

    if (gamePhase === GamePhase.PLAYER_TURN) {

      // get list of possible moves for this square
      let moves = this.invalidMove(square, piece) ? [] : 
        this.game.moves({
          square: square,
          verbose: true
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

  onSnapEnd = () => {
    
    let { gamePhase } = store.getState();
    
    if (gamePhase === GamePhase.PLACEMENT) {

      this.setBoardPosition(this.board.fen());
    
    } else if (gamePhase === GamePhase.PLAYER_TURN) {
    
      this.board.position(this.game.fen());
    
    }

  }

  onChange = (oldPosition: any, newPosition: any) => {

    console.log('onChange', oldPosition, newPosition);

  }

  makeAIMoves = () => {

    // check possible moves for each AI piece
    let columns: string[] = 'a,b,c,d,e,f,g,h'.split(','); // TODO: exclude a, because if any AI pieces end up here then a life (or the game) is lost for the player
    for (let i = 0; i < columns.length; i++) {
      for (let j = 1; j <= 8; j++) {
        let square: string = columns[i] + j.toString();
        if (this.game.get(square) && this.game.get(square).color === 'b') {
          let possibleMoves: any[] = this.game.moves({square: square});
          // TODO: make a move for each AI piece
          if (possibleMoves && possibleMoves.length) {
            this.game.move(possibleMoves[0]);
            // TODO: set the turn back to the AI, not the player!
          }
        }
      }
    }

    console.log('move AI pieces on the board');

  }

}