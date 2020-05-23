"use strict";
exports.__esModule = true;
var RequestLimit = /** @class */ (function () {
    function RequestLimit(path, method, duration, last) {
        if (last === void 0) { last = undefined; }
        this.path = path;
        this.method = method;
        this.duration = duration;
        this.last = last;
    }
    return RequestLimit;
}());
exports["default"] = RequestLimit;
