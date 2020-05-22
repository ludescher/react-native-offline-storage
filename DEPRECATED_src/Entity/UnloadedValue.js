export default class UnloadedValue {
    /**
     * @type {*}
     */
    prop;

    /**
     * @type {*}
     */
    parent;

    /**
     * 
     * @param {*} prop 
     * @param {*} parent 
     */
    constructor(prop, parent) {
        this.prop = prop;
        this.parent = parent;
    }
}
