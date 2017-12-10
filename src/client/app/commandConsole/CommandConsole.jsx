import React from 'react';
import { connect } from 'react-redux'
import { createSocketMessageReceivedAction, createSocketMessageSentAction, ACTIONS } from '../socketLogs/redux';
import { COMMANDS } from './CommandConstants';
import { getNewId } from '../Identifier';

export class SocketCommandComponent extends React.Component {
    constructor(props) {
        super(props);

        this.issueCommand = this.issueCommand.bind(this);
        this.handleSocketMessage = this.handleSocketMessage.bind(this);

        this.socket = new WebSocket("ws://localhost:3000");
        this.socket.onmessage = this.handleSocketMessage;
    }

    issueCommand(contents) {
        const command = JSON.stringify({
            method: this.commandName.value,
            message: this.commandMessage.value
        });
        this.props.socketMessageSent({
            time: new Date(),
            message: command,
            id: getNewId(),
            messageType: ACTIONS.SOCKET_SENT
        });
        this.socket.send(command);

        this.commandMessage.value = '';
    }

    handleSocketMessage(event) {
        this.props.socketMessageReceived({
            message: event.data,
            time: new Date(),
            id: getNewId(),
            messageType: ACTIONS.SOCKET_RECEIVED
        });
    }

    componentWillUnmount() {
        this.socket.close();
    }

    render() {
        return (
            <div>
                <h2>Socket Commands</h2>
                <div>
                    <label>Method Name: <select ref={(input) => this.commandName = input}>
                        {COMMANDS.map(command => (
                            <option key={command} value={command}>{command}</option>
                        ))}
                    </select></label>
                    <button type='button' onClick={this.issueCommand}>Send Command</button>
                </div>
                <div>
                    <textarea className='command-editor' ref={(input) => this.commandMessage = input} />
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
  return {
    socketMessageSent: message => {
      dispatch(createSocketMessageSentAction(message))
    },
    socketMessageReceived: message => {
      dispatch(createSocketMessageReceivedAction(message))
    }
  }
}

export default connect(null, mapDispatchToProps)(SocketCommandComponent);
