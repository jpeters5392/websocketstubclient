
const fetchMiddleware = (store) => (next) => (action) => {
    if (action.type === 'FETCH_ACTIONS') {
        // dispatch an action indicating that we are starting the fetch
        next({
            type: action.pendingActionType
        });
        fetch(action.url).then((response) => {
            response.json().then(data => {
                next({
                    type: action.successActionType,
                    payload: data
                });
            }, (error) => {
                next({
                    type: action.errorActionType,
                    payload: error,
                });
            });
        }, (error) => {
            next({
                type: action.errorActionType,
                payload: error,
            });
        });
    } else {
        // if it is not the action type we care about then continue it along
        next(action);
    }
};

export default fetchMiddleware;