import * as React from 'react';
import '../styles/app.css';
import '../styles/chessboard.css';
import '../styles/bootstrap.css';
import { BoardHelper } from '../helpers/boardhelper';
import { GamePhase } from '../types/index';

export interface Props {
    placeholder?: string;
    helper: BoardHelper;
    gamePhase: GamePhase;
}

class Board extends React.Component<Props, object> {

    componentDidMount() {
        console.log('Board componentDidMount');
    }

    componentDidUpdate(props: any, prevProps: any) {
        console.log('Board componentDidUpdate');
    }

    public render() {

        let { helper, gamePhase } = this.props;

        let showReset: boolean = gamePhase === GamePhase.PLAYER_TURN;
        let showSubmit: boolean = gamePhase === GamePhase.PLAYER_TURN ||
            gamePhase === GamePhase.PLACEMENT;

        return (
            <div>
                <div id="board" className="container" />
                <div className="board-buttons-wrapper">
                    {showReset && <button 
                        id="btnResetTurn"
                        className="btn"
                        onClick={helper.resetTurn}
                    >
                        Reset Turn
                    </button>}
                    {showSubmit && <button
                        id="btnSubmit"
                        className="btn btn-primary"
                        onClick={gamePhase === GamePhase.PLAYER_TURN ? helper.submitTurn : helper.submitPlacement}
                    >
                        {gamePhase === GamePhase.PLAYER_TURN ? 'Submit Turn' : 'Submit Placement'}
                    </button>}
                </div>
            </div>
        );  

    }

}

export default Board;