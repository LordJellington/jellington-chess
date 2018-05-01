import store from '../store/store';
import { StoreState, GamePhase } from '../types/index';
import * as React from 'react';
import { connect } from 'react-redux';
import Title from '../components/Title';
import { SET_PHASE } from '../constants/index';

class TitleContainer extends React.Component<any, any> {

    render() {

        return (
            <Title 
                title="Chess Invaders! v0.0.4"
                onStartClick={
                    () => {
                        store.dispatch({
                            type: SET_PHASE,
                            gamePhase: GamePhase.PLACEMENT 
                        });
                    }
                }
                onInstructionsClick={
                    () => {
                        store.dispatch({
                            type: SET_PHASE,
                            gamePhase: GamePhase.INSTRUCTIONS 
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

export default connect(mapStateToProps)(TitleContainer);