"use strict";
exports.__esModule = true;
var Request = /** @class */ (function () {
    function Request(path, method, header) {
        this.path = path;
        this.method = method;
        this.header = header;
        this.body = "";
        this.forceRequest = false;
    }
    return Request;
}());
exports["default"] = Request;
