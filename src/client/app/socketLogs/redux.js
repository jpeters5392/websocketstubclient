import { createSelector } from 'reselect';

export const ACTIONS = {
    'SOCKET_RECEIVED': 'SOCKET_RECEIVED',
    'SOCKET_SENT': 'SOCKET_SENT'
};

const initialState = {
    logIds: [],
    logsById: {}
};

function dateSort(a, b) {
    a = new Date(a.time);
    b = new Date(b.time);
    return a>b ? -1 : a<b ? 1 : 0;
}

const logIdsFilter = state => state.socketLogs.logIds;
const logsFilter = state => state.socketLogs.logIds.map(id => state.socketLogs.logsById[id]);

export const logsSelector = createSelector(
    logsFilter,
    items => items.sort(dateSort)
);

const socketLogs = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.SOCKET_RECEIVED: {
            return Object.assign({}, state, {
                logIds: [...state.logIds, action.payload.id]
            }, {
                logsById: Object.assign({}, state.logsById, {
                    [action.payload.id]: action.payload
                })
            });
        }
        case ACTIONS.SOCKET_SENT: {
            return Object.assign({}, state, {
                logIds: [...state.logIds, action.payload.id]
            }, {
                logsById: Object.assign({}, state.logsById, {
                    [action.payload.id]: action.payload
                })
            });
        }
        default:
        return state;
    }
};

const socketAction = (type) => (payload) => {
    return {
        type,
        payload
    };
};

export const createSocketMessageReceivedAction = socketAction(ACTIONS.SOCKET_RECEIVED);

export const createSocketMessageSentAction = socketAction(ACTIONS.SOCKET_SENT);

export default socketLogs;