let ref = null;

export const start = (intervalSeconds, onTick) => {
    ref = setInterval(onTick, intervalSeconds);
};

export const stop = () => {
    if (ref) {
        clearInterval(ref);
        ref = null;
    }
};