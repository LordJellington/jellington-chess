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
            <div>
                <h1>{title}</h1>
                <button 
                    id="startButton"
                    className="btn btn-primary"
                    onClick={onStartClick}
                >
                    Start
                </button>
            </div>
        );
    }

}

export default Title;