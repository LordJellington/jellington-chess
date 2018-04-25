import store from '../store/store';
import { StoreState, GamePhase } from '../types/index';
import * as React from 'react';
import { connect } from 'react-redux';
import { SET_PHASE, SET_GAME_WON } from '../constants/index';
import GameOver from '../components/GameOver';

class GameOverContainer extends React.Component<any, any> {

    render() {

        return (
            <GameOver 
                message={this.props.gameWon ? 'You win. Well done!' : 'You lose. Try again?'}
                onReturnClick={
                    () => {
                        store.dispatch({
                            type: SET_PHASE,
                            gamePhase: GamePhase.TITLE 
                        });
                        store.dispatch({
                            type: SET_GAME_WON,
                            gameWon: false
                        });
                    }
                }
            />
        );

    }

}

export function mapStateToProps (localStore: StoreState) {
    return {
        gameWon: localStore.gameWon
    };
}

export default connect(mapStateToProps)(GameOverContainer);