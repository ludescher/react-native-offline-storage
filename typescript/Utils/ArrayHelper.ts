export function InArray<T, B>(arr: Array<T>, propname: string, value: B): number {
    if (!(arr instanceof Array)) {
        throw new TypeError('arr is not of type Array!');
    }
    for (let i = 0; i < arr.length; i++) {
        if (propname in arr[i]) {
            // @ts-ignore
            if (arr[i][propname] === value) {
                return i;
            }
        }
    }
    return -1;
}