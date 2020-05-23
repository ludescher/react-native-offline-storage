"use strict";
exports.__esModule = true;
var RequestLimit = /** @class */ (function () {
    function RequestLimit(path, method, duration) {
        this.path = path;
        this.method = method;
        this.duration = duration;
    }
    return RequestLimit;
}());
exports["default"] = RequestLimit;
