import * as actions from '../actions/';
import { StoreState } from '../types/index';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { BoardHelper } from '../helpers/boardhelper';
import Board from '../components/Board';

class BoardContainer extends React.Component<any, any> {

    private boardHelper: BoardHelper;

    componentDidMount() {
        console.log('componentDidMount');
    }

    public render() {
        if (!this.boardHelper) {
            this.boardHelper = new BoardHelper();
        }
        return (
            <Board
                helper={this.boardHelper}
            />
        );
    }

}

// ...which massages the data from the current store to part of the shape that our component needs
export function mapStateToProps ({enthusiasmLevel, languageName}: StoreState) {
    return {
        enthusiasmLevel,
        name: languageName
    };
}

// ...which creates callback props to pump actions to our store using a given dispatch function
export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
    return {
        onIncrement: () => dispatch(actions.incrementEnthusiasm()),
        onDecrement: () => dispatch(actions.decrementEnthusiasm())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardContainer);