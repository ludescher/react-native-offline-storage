class Controller {

    /**
     * @type {Object}
     */
    state = {};

    constructor(props) {
        this.state({
            text: 'From Controller',
        });
    }
}

export default Controller;