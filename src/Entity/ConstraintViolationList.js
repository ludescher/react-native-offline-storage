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

    constructor(title, description, violations = []) {
        this.title = title;
        this.description = description;
        this.violations = violations;
    }

    toString() {
        return '[{0}]: {1}'.format(this.title, this.description);
    }
}