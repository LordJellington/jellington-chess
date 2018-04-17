import { StoreState } from '../types/index';
import * as React from 'react';
import { connect } from 'react-redux';
import { BoardHelper } from '../helpers/boardhelper';
import Board from '../components/Board';

class BoardContainer extends React.Component<any, any> {

    private boardHelper: BoardHelper;

    componentDidMount() {
        this.boardHelper.start();
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

export function mapStateToProps (storeState: StoreState) {
    return {};
}

export default connect(mapStateToProps)(BoardContainer);