import * as React from 'react';
import '../styles/app.css';
import '../styles/chessboard.css';
import '../styles/bootstrap.css';
import { BoardHelper } from '../helpers/boardhelper';

export interface Props {
    placeholder?: string;
    helper: BoardHelper;
}

class Board extends React.Component<Props, object> {

    componentDidMount() {
        console.log('Board componentDidMount');
    }

    componentDidUpdate(props: any, prevProps: any) {
        console.log('Board componentDidUpdate');
    }

    public render() {

        let { helper } = this.props;

        return (
            <div>
                <div id="board" />
                <button 
                    id="btnResetTurn"
                    className="btn"
                    onClick={helper.resetTurn}
                >
                    Reset Turn
                </button>
                <button
                    id="btnSubmitTurn"
                    className="btn btn-primary"
                    onClick={helper.submitTurn}
                >
                </button>
            </div>
        );  

    }

}

export default Board;