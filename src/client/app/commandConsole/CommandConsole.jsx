import React from 'react';
import { connect } from 'react-redux'
import { createSocketMessageReceivedAction, createSocketMessageSentAction, ACTIONS } from '../socketLogs/redux';
import { COMMANDS } from './CommandConstants';
import { getNewId } from '../Identifier';
import { createFetchScenariosAction, commandsSelector, createFetchCommandInfoAction, currentCommandSelector } from './redux';

export class SocketCommandComponent extends React.Component {
    constructor(props) {
        super(props);

        this.issueCommand = this.issueCommand.bind(this);
        this.handleSocketMessage = this.handleSocketMessage.bind(this);
        this.selectScenario = this.selectScenario.bind(this);
        this.selectCommand = this.selectCommand.bind(this);

        this.socket = new WebSocket("ws://localhost:3000");
        this.socket.onmessage = this.handleSocketMessage;

        this.state = {
            selectedScenario: null,
            selectedCommand: null
        }
    }

    componentDidMount() {
        this.props.fetchScenarios();
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
        this.setState({
            selectedCommand: null,
            selectedScenario: null
        });
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

    selectScenario(e) {
        this.setState({
            selectedCommand: null,
            selectedScenario: e.target.value
        });
    }

    selectCommand(e) {
        this.setState({
            selectedCommand: e.target.value,
            selectedScenario: this.state.selectedScenario
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.selectedCommand !== nextState.selectedCommand && nextState.selectedCommand !== null) {
            this.props.fetchCommandInfo(nextState.selectedScenario, nextState.selectedCommand);
        }

        return true;
    }

    render() {
        let selectedScenario = null;
        if (this.state.selectedScenario) {
            selectedScenario = this.props.commands.filter(command => command.id == this.state.selectedScenario)[0];
        }

        if (this.props.currentCommand !== null) {
            this.commandName.value = this.props.currentCommand.method;
            this.commandMessage.value = JSON.stringify(this.props.currentCommand.data);
        }

        return (
            <div>
                <h2>Socket Commands</h2>
                <div>
                    <div className='command-console-method-input'>
                    <label>Method Name: <select ref={(input) => this.commandName = input}>
                        {COMMANDS.map(command => (
                            <option key={command} value={command}>{command}</option>
                        ))}
                    </select></label>
                    <button type='button' onClick={this.issueCommand}>Send Command</button>
                    </div>
                    <div className='command-console-scenario-selection'>
                        <label>
                            Scenario: 
                            <select onChange={this.selectScenario} value={this.state.selectedScenario}>
                                <option value=''></option>
                                {this.props.commands.map(command => (
                                    <option key={command.id} value={command.id}>{command.name}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Command: 
                            <select onChange={this.selectCommand} value={this.state.selectedCommand}>
                                <option value=''></option>
                                {selectedScenario !== null && Object.keys(selectedScenario.commands).map(commandId => (
                                    <option key={commandId} value={selectedScenario.commands[commandId].id}>{selectedScenario.commands[commandId].name}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
                <div>
                    <textarea className='command-editor' ref={(input) => this.commandMessage = input} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const commands = commandsSelector(state);
    return {
        commands: commands.commands,
        isLoading: commands.isLoading,
        currentCommand: currentCommandSelector(state)
    };
};

const mapDispatchToProps = dispatch => {
  return {
    socketMessageSent: message => {
      dispatch(createSocketMessageSentAction(message));
    },
    socketMessageReceived: message => {
      dispatch(createSocketMessageReceivedAction(message));
    },
    fetchScenarios: () => {
        dispatch(createFetchScenariosAction());
    },
    fetchCommandInfo: (scenarioId, commandId) => {
        dispatch(createFetchCommandInfoAction(scenarioId, commandId));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocketCommandComponent);
