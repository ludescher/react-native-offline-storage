export default function throwError(msg = null) {
    if (__DEV__) {
        if (!msg) {
            throw "msg is null!?!";
        }
        let _error = new Error(msg);
        console.error(_error);
        throw _error;
    }
}