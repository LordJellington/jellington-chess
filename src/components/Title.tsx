import * as React from 'react';
import '../styles/app.css';
import '../styles/bootstrap.css';

export interface Props {
    title: string;
    onStartClick: () => void;
}

class Title extends React.Component<Props, object> {

    render() {

        let { title, onStartClick } = this.props;

        return (
            <div className="container">
                <h1>{title}</h1>
                <p>by Lord Jellington (with an awful lot of help from chess.js and chessboardjs)</p>
                <button 
                    id="startButton"
                    className="btn btn-primary"
                    onClick={onStartClick}
                >
                    Start
                </button>             

                <div className="instructions-wrapper">
                    <h3>Instructions</h3>
                    <div className="instructions">
                        <p>Still a very early work in progress, but here are a few rules for now</p>
                        <ul>
                            <li>You get 4 pieces: a queen, a bishop, a knight, and a rook</li>
                            <li>You can place them anywhere in the bottom two rows before you start</li>
                            <li>Once you start, enemy pieces will spawn at random on the top row</li>
                            <li>If an enemy piece spawns over the top of one of your pieces then your piece is captured</li>
                            <li>Leaving one on your pieces on the top row will increase the chance of an enemy piece spawning there</li>
                            <li>The enemy pieces can move a maximum of 4 squares in one turn</li>
                            <li>An enemy piece will always capture one of your pieces if it can (without breaking the 4 square movement rule)</li>
                            <li>Enemy knights move like regular knights</li>
                            <li>Enemy pawns move like regular pawns</li>
                            <li>Your pieces move like regular pieces</li>
                            <li>If an enemy piece reaches the bottom row and survives there for one turn it is game over for you</li>
                            <li>If you survive 20 turns without that happening then you win</li>
                            <li>Please send constructive feedback to james.ellins@gmail.com</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

}

export default Title;