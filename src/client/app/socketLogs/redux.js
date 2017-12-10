import { createSelector } from 'reselect';

export const ACTIONS = {
    'SOCKET_RECEIVED': 'SOCKET_RECEIVED',
    'SOCKET_SENT': 'SOCKET_SENT',
    'PAGE_SIZE_CHANGED': 'PAGE_SIZE_CHANGED',
    'PAGE_CHANGED': 'PAGE_CHANGED'
};

const initialState = {
    logIds: [],
    logsById: {},
    logsPerPage: 20,
    currentPage: 0
};

function dateSort(a, b) {
    a = new Date(a.time);
    b = new Date(b.time);
    return a>b ? -1 : a<b ? 1 : 0;
}

const logIdsFilter = state => state.socketLogs.logIds;
const logsPerPageFilter = state => ({
    logsPerPage: state.socketLogs.logsPerPage,
    currentPage: state.socketLogs.currentPage
});
const logsFilter = state => state.socketLogs.logsById;

export const logsSelector = createSelector(
    logIdsFilter,
    logsFilter,
    logsPerPageFilter,
    (ids, items, pageInfo) => {
        const begIndex = pageInfo.currentPage * pageInfo.logsPerPage;
        const endIndex = begIndex * 1 + pageInfo.logsPerPage * 1;
        return {
            count: ids.length,
            logs: ids.map(id => items[id]).sort(dateSort).slice(begIndex, endIndex),
            pageSize: pageInfo.logsPerPage,
            currentPage: pageInfo.currentPage
        };
    }
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
        case ACTIONS.PAGE_SIZE_CHANGED: {
            return Object.assign({}, state, {
                logsPerPage: action.payload
            });
        }
        case ACTIONS.PAGE_CHANGED: {
            return Object.assign({}, state, {
                currentPage: action.payload
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

export const createPageSizeChangeAction = (newPageSize) => ({
    type: ACTIONS.PAGE_SIZE_CHANGED,
    payload: newPageSize
});

export const createPageChangeAction = (newPage) => ({
    type: ACTIONS.PAGE_CHANGED,
    payload: newPage
});

export const createSocketMessageReceivedAction = socketAction(ACTIONS.SOCKET_RECEIVED);

export const createSocketMessageSentAction = socketAction(ACTIONS.SOCKET_SENT);

export default socketLogs;