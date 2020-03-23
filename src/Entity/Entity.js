import UnloadedValue from "./UnloadedValue";

export default class Entity {
    static Iri = null; //Internationalized Resource Identifier (replaces class name)
    static TypeMap = {};
    static UniqueProperty = "id";

    entityId = null;

    applyData(newdata) {
        let keysArray = Object.keys(newdata);
        for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
            let nextKey = keysArray[nextIndex];
            let desc = Object.getOwnPropertyDescriptor(newdata, nextKey);
            if (desc !== undefined && desc.enumerable) {
                if (!(newdata[nextKey] instanceof UnloadedValue)) {
                    this[nextKey] = newdata[nextKey];
                }
            }
        }
    }
}
