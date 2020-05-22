export default class ConstraintViolationList {
    /**
     * @type {String}
     */
    title;

    /**
     * @type {String}
     */
    description;

    /**
     * @type {Array<Object>}
     */
    violations;

    /**
     * 
     * @param {String} title 
     * @param {String} description 
     * @param {Array<Object>} violations 
     */
    constructor(title, description, violations = []) {
        this.title = title;
        this.description = description;
        this.violations = violations;
    }

    toString() {
        return `[${this.title}]: ${this.description}`;
    }
}