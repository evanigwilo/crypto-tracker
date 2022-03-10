interface IDeBounceVariables {
    timeout: NodeJS.Timeout | undefined, // holder for timeout id
    delay: number, // delay after event is "complete" to run callback
}
interface IDeBounceID {
    [id: string]: IDeBounceVariables;
}
export const deBounceID: IDeBounceID = {};

export default function debounce(id: string, callback: () => void, delay: number = 500) {
    if (!deBounceID[id]) {
        deBounceID[id] = {
            timeout: undefined,
            delay: delay
        };
    }

    const getID = deBounceID[id];
    // clear the timeout

    getID.timeout && clearTimeout(getID.timeout);
    // start timing for event "completion"
    getID.timeout = setTimeout(() => callback(), getID.delay);
};
