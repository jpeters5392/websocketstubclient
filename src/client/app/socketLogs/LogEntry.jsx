import React from 'react';
import JsonText from './JsonText.jsx';

class LogEntry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpanded: false
        };

        this.toggleExpanded = this.toggleExpanded.bind(this);
    }

    toggleExpanded() {
        this.setState({
            isExpanded: !this.state.isExpanded
        });
    }

    render() {
        const logType = this.props.type;
        if (this.state.isExpanded) {
            const logObject = JSON.parse(this.props.message);
            const className = 'expanded clickable ' + logType;
            return (
                <div>
                    <div className={className} onClick={this.toggleExpanded}>{this.props.time.toLocaleString()}</div>
                    <ul>
                        {Object.keys(logObject).map(key => (
                            <li key={key}>
                                <JsonText name={key} text={logObject[key]} />
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }

        const className = 'collapsed ' + logType;
        return (
            <div className={className}>
                <span className='clickable' onClick={this.toggleExpanded}>{this.props.time.toLocaleString()} - {this.props.message.substring(0, 100)}</span>
            </div>
        );
    }
}

export default LogEntry;