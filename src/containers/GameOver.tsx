import store from '../store/store';
import { StoreState, GamePhase } from '../types/index';
import * as React from 'react';
import { connect } from 'react-redux';
import { SET_PHASE } from '../constants/index';
import GameOver from '../components/GameOver';

class GameOverContainer extends React.Component<any, any> {

    render() {

        return (
            <GameOver 
                message="You lose"
                onReturnClick={
                    () => {
                        store.dispatch({
                            type: SET_PHASE,
                            gamePhase: GamePhase.TITLE 
                        });
                    }
                }
            />
        );

    }

}

export function mapStateToProps (localStore: StoreState) {
    return {};
}

export default connect(mapStateToProps)(GameOverContainer);