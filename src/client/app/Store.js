import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import socketLogs from './socketLogs/redux';
import commands from './commandConsole/redux';
import fetchMiddleware from './middleware/fetchMiddleware';

const rootReducer = combineReducers({
    socketLogs,
    commands
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(fetchMiddleware)));

export default store;