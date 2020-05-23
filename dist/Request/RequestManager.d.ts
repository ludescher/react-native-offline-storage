import Request from "./Request";
import RequestLimit from './RequestLimit';
declare class RequestManager {
    static limits: Array<RequestLimit>;
    static Add<T>(request: Request): Promise<T>;
    static AddLimit(limit: RequestLimit): void;
    private static GetIndex;
    private static FindLimitByRequest;
}
export default RequestManager;
