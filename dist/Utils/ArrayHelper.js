"use strict";
exports.__esModule = true;
exports.InArray = void 0;
function InArray(arr, propname, value) {
    if (!(arr instanceof Array)) {
        throw new TypeError('arr is not of type Array!');
    }
    for (var i = 0; i < arr.length; i++) {
        if (propname in arr[i]) {
            // @ts-ignore
            if (arr[i][propname] === value) {
                return i;
            }
        }
    }
    return -1;
}
exports.InArray = InArray;
