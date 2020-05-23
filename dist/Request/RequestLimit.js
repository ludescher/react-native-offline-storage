class RequestLimit {
    constructor(path, method, duration, last = undefined) {
        this.path = path;
        this.method = method;
        this.duration = duration;
        this.last = last;
    }
}
export default RequestLimit;