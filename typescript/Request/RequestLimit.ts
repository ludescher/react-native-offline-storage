import RequestMethod from './RequestMethod';

class RequestLimit {
    path: string;
    method: RequestMethod;
    duration: number;
    last: Date;

    constructor(path: string, method: RequestMethod, duration: number) {
        this.path = path;
        this.method = method;
        this.duration = duration;
    }
}

export default RequestLimit;