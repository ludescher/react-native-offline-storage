export default class StorageListener {
    /**
     * @type {Number}
     */
    id;

    /**
     * @type {String}
     */
    propname;

    /**
     * @type {String}
     */
    componentname;

    /**
     * @type {Element}
     */
    component;

    /**
     * @type {Function}
     */
    callback;

    constructor(propname, componentname, component, callback) {
        this.propname = propname;
        this.componentname = componentname;
        this.component = component;
        this.callback = callback;
        this.id = null;
    }
}