import * as React from 'react';
import '../styles/app.css';
import '../styles/bootstrap.css';

interface Props {
    selectedMode: string;
    onSelect(selectElementId: string): void;
}

class GameModeSelect extends React.Component<Props, object> {

    render () {
        return (
            <div className="container">
                <div className="form-group">
                    <label>Game Mode:</label>
                    <select id="game-mode-select" className="form-control" value={this.props.selectedMode} onChange={e => this.props.onSelect(e.target.id)}>
                        <option value={'normal'}>Normal</option>
                        <option value={'harder'}>A bit harder</option>
                        <option value={'horsies'}>Horsies!!!</option>
                    </select>
                </div>
            </div>
        );
    }

}

export default GameModeSelect;