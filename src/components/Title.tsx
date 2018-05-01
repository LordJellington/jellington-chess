import * as React from 'react';
import '../styles/app.css';
import '../styles/bootstrap.css';

export interface Props {
    title: string;
    onStartClick: () => void;
    onInstructionsClick: () => void;
}

class Title extends React.Component<Props, object> {

    render() {

        let { title, onStartClick, onInstructionsClick } = this.props;

        return (
            <div className="container">
                <img 
                    title={title}
                    className="title-logo"
                    src="assets/chess-invaders-logo.png"
                />
                <p>by Lord Jellington (with an awful lot of help from chess.js and chessboardjs)</p>
                
                <div className="title-buttons">
                    <button 
                        id="startButton"
                        className="btn btn-primary"
                        onClick={onStartClick}
                    >
                        Start
                    </button>    

                    <button 
                        id="instructionsButton"
                        className="btn"
                        onClick={onInstructionsClick}
                    >
                        Instructions
                    </button>            
                </div>

            </div>
        );
    }

}

export default Title;