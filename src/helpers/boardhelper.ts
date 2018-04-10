// import store from '../store/store'; TODO: reinstate when I need it

export class BoardHelper {

    private chess: any;

    constructor() {
        var Chess = require('chess.js');
        this.chess = new Chess();
    }

    public doSomething = (): void => {
        let moves = this.chess.moves();
        let move = moves[Math.floor(Math.random() * moves.length)];
        this.chess.move(move);
        console.log(this.chess.pgn());
    }

}