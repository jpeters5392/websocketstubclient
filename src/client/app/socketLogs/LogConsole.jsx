import React from 'react';
import { connect } from 'react-redux'
import { logsSelector } from './redux';
import LogEntry from './LogEntry.jsx';

export class LogConsoleComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h2>Log Console ({this.props.logs.length} entries)</h2>
                <ul>
                    {this.props.logs.map(logEntry => (
                        <li className='log-entry' key={logEntry.id}>
                            <LogEntry type={logEntry.messageType} message={logEntry.message} time={logEntry.time} />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = state => {
  return {
    logs: logsSelector(state)
  }
}

export default connect(
  mapStateToProps
)(LogConsoleComponent);
