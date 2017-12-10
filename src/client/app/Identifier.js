let globalId = 0;

export function getNewId() {
    globalId += 1;
    return globalId;
}