export function InArray(arr, propname, value) {
    if (!(arr instanceof Array)) {
        throw new TypeError('arr is not of type Array!');
    }
    for (let i = 0; i < arr.length; i++) {
        if (propname in arr[i]) {
            if (arr[i][propname] === value) {
                return i;
            }
        }
    }
    return -1;
}