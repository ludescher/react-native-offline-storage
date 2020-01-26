/**
 * 
 * @param {Array<*>} arr 
 * @param {String} propname 
 * @param {*} value 
 * @param {Boolean} index 
 * @returns {(Boolean|Number)}
 */
export function inArray(arr, propname, value, index = false) {
    if (!arr) {
        return (index) ? -1 : false;
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].hasOwnProperty(propname)) {
            if (arr[i][propname] == value) {
                return (index) ? i : true;
            }
        }
    }
    return (index) ? -1 : false;
}

/**
 * 
 * @param {Array<*>} arr 
 * @returns {Number}
 */
export function generateUniqueId(arr) {
    let i = 0;
    for (i; i < arr.length; i++) {
        let _index = inArray(arr, 'id', i, true);
        if (_index === -1) {
            return i;
        }
    }
    return i;
}
