export default class HydraError {
    /**
     * @type {String}
     */
    title;

    /**
     * @type {String}
     */
    description;

    /**
     * @type {Array<String>}
     */
    trace;

    /**
     * 
     * @param {String} title 
     * @param {String} description 
     * @param {Array<String>} trace 
     */
    constructor(title, description, trace = []) {
        this.title = title;
        this.description = description;
        this.trace = trace;
    }

    toString() {
        return `[${this.title}]: ${this.description}`;
    }
}