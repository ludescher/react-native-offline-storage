class Request {
    constructor(path, method, header) {
        this.path = path;
        this.method = method;
        this.header = header;
        this.body = "";
        this.forceRequest = false;
    }
}
export default Request;