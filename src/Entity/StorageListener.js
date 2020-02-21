export default class StorageListener {
    /**
     * @type {Number}
     */
    id;

    /**
     * @type {String}
     */
    key;

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

    /**
     * 
     * @param {String} key 
     * @param {String} componentname 
     * @param {Element} component 
     * @param {Function} callback 
     */
    constructor(key, componentname, component, callback) {
        this.key = key;
        this.componentname = componentname;
        this.component = component;
        this.callback = callback;
        this.id = null;
    }
}