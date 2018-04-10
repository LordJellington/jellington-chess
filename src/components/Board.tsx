import * as React from 'react';
import '../styles/app.css';
import '../styles/chessboard.css';
import '../styles/bootstrap.css'
var ChessBoard = require('chessboardjs');

export interface Props {
    placeholder?: string;
    doSomething: () => void;
}

class Board extends React.Component<Props, object> {

    componentDidMount() {
        ChessBoard('board');
    }

    componentDidUpdate(props: any, prevProps: any) {
        ChessBoard('board');
    }

    public render() {

        return (
            <div>
                <div id="board" />
                <button 
                    id="do-something"
                    className="btn btn-primary"
                    onClick={this.props.doSomething}
                >
                    Do Something
                </button>
            </div>
        );  

    }

}

export default Board;