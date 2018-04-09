import * as React from 'react';
import './Hello.css';
import './chessboard.css';
var ChessBoard = require('chessboardjs');

export interface Props {
    placeholder?: string;
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
            <div id="board" />
        );

    }

}

export default Board;