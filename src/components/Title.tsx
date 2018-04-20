import * as React from 'react';
import '../styles/app.css';
import '../styles/bootstrap.css';

export interface Props {
    title: string;
    onStartClick: () => void;
}

declare var $: any;

class Title extends React.Component<Props, object> {

    render() {

        let { title, onStartClick } = this.props;

        return (
            <div className="container">
                <h1>{title}</h1>
                <button 
                    id="startButton"
                    className="btn btn-primary"
                    onClick={onStartClick}
                >
                    Start
                </button>

                <div className="instructions-wrapper">
                    <button 
                        type="button" 
                        className="btn btn-info"
                        onClick={() => { $('.instructions').toggle(); }}
                    >
                        Instructions
                    </button>
                    <div className="instructions">
                        {// TODO: fill out instructions
                         // explain how enemy pieces will spawn on the top row and you leave your pieces there at your own risk
                         // explain how the enemy pieces move (i.e. no more than 4 spaces in one move), pawns can only move one square at a time    
                         // if an enemy piece begins its turn at the bottom row of the board, then you lost the game or lose a life 
                        }
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </div>
                </div>
            </div>
        );
    }

}

export default Title;