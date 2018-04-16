import store from '../store/store';
import { StoreState, GamePhase } from '../types/index';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Title from '../components/Title';
import { SET_PHASE } from '../constants/index'

class TitleContainer extends React.Component<any, any> {

    render() {

        return (
            <Title 
                title='Chess Invasion!'
                onStartClick={
                    () => {
                        store.dispatch({
                            type: SET_PHASE,
                            phase: GamePhase.IN_GAME 
                        });
                    }
                }
            />
        );

    }

}

export function mapStateToProps (store: StoreState) {
    return {};
}

export default connect(mapStateToProps)(TitleContainer);