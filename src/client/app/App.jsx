import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Store from './Store';
import LogConsole from './socketLogs/LogConsole.jsx';
import CommandConsole from './commandConsole/CommandConsole.jsx';

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <Provider store={Store}>
                <div>
                    <header>
                        <a className='site-link' href='/'>Web Socket Stub Client</a>
                    </header>
                    <section>
                        <div className='log-console'>
                            <LogConsole />
                        </div>
                    </section>
                    <footer>
                        <div className='command-console'>
                            <CommandConsole />
                        </div>
                    </footer>
                </div>
            </Provider>
        );
    }
}

render(<App/>, document.getElementById('app'));