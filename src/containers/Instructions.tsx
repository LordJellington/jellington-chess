import store from '../store/store';
import { StoreState, GamePhase } from '../types/index';
import * as React from 'react';
import { connect } from 'react-redux';
import Instructions from '../components/Instructions';
import { SET_PHASE } from '../constants/index';

class InstructionsContainer extends React.Component<any, any> {

    render() {

        return (
            <Instructions 
                onBackClick={
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

export default connect(mapStateToProps)(InstructionsContainer);