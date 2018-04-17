import * as React from 'react';
import '../styles/app.css';
import '../styles/bootstrap.css';

export interface Props {
    message: string;
    onReturnClick: () => void;
}

class GameOver extends React.Component<Props, object> {

    render() {

        let { message, onReturnClick } = this.props;

        return (
            <div>
                <h1>{message}</h1>
                <button 
                    id="gameOverButton"
                    className="btn btn-primary"
                    onClick={onReturnClick}
                >
                    Return to Title
                </button>
            </div>
        );
    }

}

export default GameOver;