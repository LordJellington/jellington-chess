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
                    id="setPosition"
                    className="btn"
                    onClick={helper.setPosition}
                >
                    Set Position
                </button>
            </div>
        );  

    }

}

export default Board;