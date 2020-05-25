class AbstractController {

    /**
     * @type {Object}
     */
    state = {};

    /**
     * 
     * @param {Object} props 
     */
    constructor(props) { }

    /**
     * 
     * @param {Object} state 
     */
    setState(state) { }

    componentDidMount() { }

    /**
     * 
     * @param {Object} prevProps 
     * @param {Object} prevState 
     * @param {Object} snapshot 
     */
    componentDidUpdate(prevProps, prevState, snapshot) { }

    componentWillUnmount() { }
}

export default AbstractController;