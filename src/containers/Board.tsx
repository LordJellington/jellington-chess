import { StoreState, GamePhase } from '../types/index';
import * as React from 'react';
import { connect } from 'react-redux';
import { BoardHelper } from '../helpers/boardhelper';
import Board from '../components/Board';
import GameModeSelect from '../components/GameModeSelect';
import { ROUNDS_TO_WIN } from '../constants';

class BoardContainer extends React.Component<any, any> {

    private boardHelper: BoardHelper;

    componentDidMount() {
        this.boardHelper.start();
    }

    public render() {
        
        let { gamePhase, roundNumber, gameMode } = this.props;

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
            {(gamePhase === GamePhase.PLAYER_TURN || gamePhase === GamePhase.AI_TURN) && <span className="label label-default rounds-remaining">{roundsRemainingMessage}</span>}
            {gamePhase === GamePhase.PLACEMENT && <GameModeSelect selectedMode={gameMode} onSelect={this.boardHelper.setGameMode} />}
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
        roundNumber: storeState.roundNumber,
        gameMode: storeState.gameMode
    };
}

export default connect(mapStateToProps)(BoardContainer);