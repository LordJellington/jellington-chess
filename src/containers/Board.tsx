import { StoreState } from '../types/index';
import * as React from 'react';
import { connect } from 'react-redux';
import { BoardHelper } from '../helpers/boardhelper';
import Board from '../components/Board';
import { ROUNDS_TO_WIN } from '../constants';

class BoardContainer extends React.Component<any, any> {

    private boardHelper: BoardHelper;

    componentDidMount() {
        this.boardHelper.start();
    }

    public render() {
        
        let { gamePhase, roundNumber } = this.props;

        if (!this.boardHelper) {
            this.boardHelper = new BoardHelper();
        }

        let roundsRemaining = ROUNDS_TO_WIN - roundNumber;
        let roundsRemainingMessage: string = '';

        if (roundsRemaining === 1) {
            roundsRemainingMessage = 'Hold on for one more turn. You can do this!';
        } else {
            roundsRemainingMessage = roundsRemaining.toString() + ' turns to go. Hang in there!';
        }

        return (
        <div>
            <span className="label label-default rounds-remaining">{roundsRemainingMessage}</span>
            <Board
                helper={this.boardHelper}
                gamePhase={gamePhase}
            />
        </div>);
    }

}

export function mapStateToProps (storeState: StoreState) {
    return {
        gamePhase: storeState.gamePhase,
        roundNumber: storeState.roundNumber
    };
}

export default connect(mapStateToProps)(BoardContainer);