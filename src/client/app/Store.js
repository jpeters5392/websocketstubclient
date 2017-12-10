import { combineReducers, createStore } from 'redux';
import socketLogs from './socketLogs/redux';

const rootReducer = combineReducers({
    socketLogs,
});

const store = createStore(rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;