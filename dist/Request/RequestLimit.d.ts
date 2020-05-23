import RequestMethod from './RequestMethod';
declare class RequestLimit {
    path: string;
    method: RequestMethod;
    duration: number;
    last: Date;
    constructor(path: string, method: RequestMethod, duration: number);
}
export default RequestLimit;
