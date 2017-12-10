import { createSelector } from 'reselect';

export const ACTIONS = {
    'FETCHING_SCENARIO_INFO': 'FETCHING_SCENARIO_INFO',
    'SCENARIO_INFO_RECEIVED': 'SCENARIO_INFO_RECEIVED',
    'SCENARIO_INFO_FAILED': 'SCENARIO_INFO_FAILED',
    'COMMAND_INFO_RECEIVED': 'COMMAND_INFO_RECEIVED',
    'COMMAND_INFO_FAILED': 'COMMAND_INFO_FAILED',
    'FETCHING_COMMAND_INFO': 'FETCHING_COMMAND_INFO'
};

const initialState = {
    scenarioIds: [],
    scenariosById: {},
    isLoading: false,
    currentCommandInfo: null
};

const scenarioIdsFilter = state => state.commands.scenarioIds;
const scenariosByIdFilter = state => state.commands.scenariosById;
const loadingFilter = state => state.commands.isLoading;
const currentCommandFilter = state => state.commands.currentCommandInfo;

export const commandsSelector = createSelector(
    scenarioIdsFilter,
    scenariosByIdFilter,
    loadingFilter,
    (ids, scenarios, isLoading) => {
        return {
            commands: ids.map(id => scenarios[id]),
            isLoading: isLoading
        };
    }
);

export const currentCommandSelector = createSelector(
    currentCommandFilter,
    (currentCommand) => currentCommand
);

const commands = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.FETCHING_SCENARIO_INFO: {
            return Object.assign({}, state, {
                isLoading: true,
                currentCommandInfo: null
            });
        }
        case ACTIONS.SCENARIO_INFO_RECEIVED: {
            const scenarioIds = Object.keys(action.payload);
            return Object.assign({}, state, {
                scenarioIds: scenarioIds,
                scenariosById: Object.assign({}, action.payload),
                isLoading: false
            });
        }
        case ACTIONS.SCENARIO_INFO_FAILED: {
            return Object.assign({}, state, {
                isLoading: false
            });
        }
        case ACTIONS.FETCHING_COMMAND_INFO: {
            return Object.assign({}, state, {
                isLoading: true,
                currentCommandInfo: null
            });
        }
        case ACTIONS.COMMAND_INFO_RECEIVED: {
            const scenarioIds = Object.keys(action.payload);
            return Object.assign({}, state, {
                currentCommandInfo: action.payload
            });
        }
        case ACTIONS.COMMAND_INFO_FAILED: {
            return Object.assign({}, state, {
                isLoading: false
            });
        }
        default:
        return state;
    }
};

export const createFetchScenariosAction = () => {
    return {
        type: 'FETCH_ACTIONS',
        successActionType: ACTIONS.SCENARIO_INFO_RECEIVED,
        errorActionType: ACTIONS.SCENARIO_INFO_FAILED,
        pendingActionType: ACTIONS.FETCHING_SCENARIO_INFO,
        url: 'http://localhost:3000/api/scenarios'
    };
};

export const createFetchCommandInfoAction = (scenarioId, commandId) => {
    return {
        type: 'FETCH_ACTIONS',
        successActionType: ACTIONS.COMMAND_INFO_RECEIVED,
        errorActionType: ACTIONS.COMMAND_INFO_FAILED,
        pendingActionType: ACTIONS.FETCHING_COMMAND_INFO,
        url: 'http://localhost:3000/api/scenarios/'+scenarioId+'/'+commandId
    };
};

export default commands;