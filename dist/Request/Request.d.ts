import RequestMethod from './RequestMethod';
declare class Request {
    path: string;
    method: RequestMethod;
    header: object;
    body: string;
    forceRequest: boolean;
    constructor(path: string, method: RequestMethod, header: object);
}
export default Request;
