import RequestMethod from './RequestMethod';

class Request {
    path: string;
    method: RequestMethod;
    header: object;
    body: string;
    forceRequest: boolean;

    constructor(path: string, method: RequestMethod, header: object) {
        this.path = path;
        this.method = method;
        this.header = header;
        this.body = "";
        this.forceRequest = false;
    }
}

export default Request;