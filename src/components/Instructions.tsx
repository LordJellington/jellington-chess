import * as React from 'react';
import '../styles/app.css';
import '../styles/bootstrap.css';

export interface Props {
    onBackClick: () => void;
}

class Instructions extends React.Component<Props, object> {

    render() {

        let { onBackClick } = this.props;

        return (
            <div className="container instructions-wrapper">
                <button 
                    id="backButton"
                    className="btn"
                    onClick={onBackClick}
                >
                    Back
                </button>  
                <h2>Instructions</h2>
                <p>Still a work in progress, but here are a few rules for now</p>
                <ul className="instructions">
                    <li>You get a few pieces that differ depending on game mode</li>
                    <li>You can place them anywhere in the bottom two rows before you start</li>
                    <li>Once you start, enemy pieces will spawn at random on the top row</li>
                    <li>If an enemy piece spawns over the top of one of your pieces then your piece is captured</li>
                    <li>Leaving one on your pieces on a top row square will increase the chance of an enemy piece spawning there</li>
                    <li>The enemy pieces can move a maximum of 4 squares in one turn. Pawns can move a maximum of 1 spaces.</li>
                    <li>An enemy piece will always capture one of your pieces if it can (without breaking the 4 square movement rule in either direction)</li>
                    <li>Your pieces move like regular pieces</li>
                    <li>If an enemy piece reaches the bottom row and survives there for one turn it is game over for you</li>
                    <li>If you survive 20 turns without that happening then you win</li>
                </ul>
            </div>
        );
    }

}

export default Instructions;