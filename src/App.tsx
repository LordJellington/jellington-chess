import { StoreState, GamePhase } from './types/index';
import * as React from 'react';
import { connect } from 'react-redux';
import BoardContainer from './containers/Board';
import TitleContainer from './containers/Title';
import GameOverContainer from './containers/GameOver';
import './App.css';

class App extends React.Component<any, any> {
  
  render() {
    let { gamePhase } = this.props;
    return (
      <div className="App">
        {gamePhase === GamePhase.TITLE && <TitleContainer/>}
        {(gamePhase === GamePhase.PLACEMENT || gamePhase === GamePhase.AI_TURN || gamePhase === GamePhase.PLAYER_TURN) && <BoardContainer />}
        {gamePhase === GamePhase.GAME_OVER && <GameOverContainer />}
      </div>
    );
  }
}

export function mapStateToProps ({gamePhase}: StoreState) {
  return {
      gamePhase
  };
}

export default connect(mapStateToProps)(App);