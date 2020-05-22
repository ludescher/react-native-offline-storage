/**
 * 
 * @param {Array<*>} arr 
 * @param {String} key 
 * @param {*} value 
 * @param {Boolean} index 
 * @returns {(Boolean|Number)}
 */
export function inArray(arr, key, value, index = false) {
    if (!arr) {
        return (index) ? -1 : false;
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].hasOwnProperty(key)) {
            if (arr[i][key] == value) {
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
