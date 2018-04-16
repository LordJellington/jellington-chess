import store from '../store/store';
import { GamePhase } from '../types/index';

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

  onDragStart = (source: any, piece: any) => {

    let gamePhase = store.getState().gamePhase;

    // do not pick up pieces if the game is over
    // or if it's not that side's turn
    if (
      (gamePhase !== GamePhase.PLAYER_TURN && gamePhase !== GamePhase.PLACEMENT) ||
      this.game.game_over() === true ||
      (this.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (this.game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }

    return true; // TODO: may need to return something else, or remove this line altogether
  }

  onDrop = (source: any, target: any) => {
    this.removeGreySquares();

    // see if the move is legal
    var move = this.game.move({
      from: source,
      to: target,
      // promotion: 'q' // NOTE: always promote to a queen for example simplicity, not using this in my version
    });

    // illegal move
    if (move === null) {
      return 'snapback';
    }

    return true; // TODO: may need to return something else, or remove this line altogether
  }

  onMouseoverSquare = (square: any, piece: any) => {
    // get list of possible moves for this square
    let moves = this.game.moves({
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
  }

  onMouseoutSquare = (square: any, piece: any) => {
    this.removeGreySquares();
  }

  onSnapEnd = () => {
    this.board.position(this.game.fen());
  }

  onMoveEnd = (oldPosition: any, newPosition: any) => {
    // TODO: set whose turn it is based on the state (PLAYER_TURN or AI_TURN)
    // this will involve getting a string representation of the board (i.e. fen), adjusting it to alter whose turn it is, and then updating the board
  }

}