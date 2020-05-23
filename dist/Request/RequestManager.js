var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import RequestLimitError from './RequestLimitError';
let RequestManager = (() => {
    class RequestManager {
        static Add(request) {
            return __awaiter(this, void 0, void 0, function* () {
                const _limit = this.FindLimitByRequest(request);
                if (!_limit) {
                    throw new RequestLimitError(request.path);
                }
                if (request.forceRequest) {
                    return new Promise(() => { });
                }
                const _limitreached = false;
                if (_limitreached) {
                    return new Promise(() => { });
                }
                else {
                    throw new RequestLimitError(request.path);
                }
            });
        }
        static AddLimit(limit) {
            if (this.GetIndex(limit) === -1) {
                this.limits.push(limit);
            }
        }
        static GetIndex(limit) {
            for (let i = 0; i < this.limits.length; i++) {
                if (this.limits[i] === limit) {
                    return i;
                }
            }
            return -1;
        }
        static FindLimitByRequest(request) {
            for (let i = 0; i < this.limits.length; i++) {
                const _limit = this.limits[i];
                if (_limit.path === request.path && _limit.method === request.method) {
                    return _limit;
                }
            }
            return undefined;
        }
    }
    RequestManager.limits = [];
    return RequestManager;
})();
export default RequestManager;