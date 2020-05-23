import Request from "./Request";
import RequestLimitError from './RequestLimitError';
import RequestLimit from './RequestLimit';

class RequestManager {
    static limits: Array<RequestLimit> = [];

    static async Add<T>(request: Request): Promise<T> {
        const _limit: undefined | RequestLimit = this.FindLimitByRequest(request);
        if (!_limit) {
            throw new RequestLimitError(request.path);
        }
        if (request.forceRequest) {
            return new Promise(() => { });
        }
        const _limitreached = false;

        if (_limitreached) {
            return new Promise(() => { });
        } else {
            throw new RequestLimitError(request.path);
        }
    }

    static AddLimit(limit: RequestLimit): void {
        if (this.GetIndex(limit) === -1) {
            this.limits.push(limit);
        }
    }

    private static GetIndex(limit: RequestLimit): number {
        for (let i = 0; i < this.limits.length; i++) {
            if (this.limits[i] === limit) {
                return i;
            }
        }
        return -1;
    }

    private static FindLimitByRequest(request: Request): undefined | RequestLimit {
        for (let i = 0; i < this.limits.length; i++) {
            const _limit: RequestLimit = this.limits[i];
            if (_limit.path === request.path && _limit.method === request.method) {
                return _limit;
            }
        }
        return undefined;
    }
}

export default RequestManager;