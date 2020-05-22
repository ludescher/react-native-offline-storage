import React from 'react';
import PropTypes from 'prop-types';
import DefaultLoadingIndicator from './DefaultLoadingIndicator';
import StorageManager from '../Manager/StorageManager';
import throwError from '../Service/ErrorService';

class Provider extends React.Component {
    
    /**
     * @type {Object}
     */
    state = {};
    
    constructor(props) {
        super(props);

        this.state = {
            initialized: false
        };
    }

    render() {
        return (this.state.initialized) ? this.props.children : this.props.loadingIndicator;
    }

    componentDidMount() {
        this.initialize();
    }

    initialize = async () => {
        if (typeof this.props.mapping === 'object') {
            await StorageManager.initialize(this.props.mapping, this.props.nullValues);
            this.props.initializationDone(StorageManager._storage);
            this.setState({
                initialized: true,
            });
        } else {
            throwError("mapping should be of type object!");
        }
    }
}
  
Provider.propTypes = {
    mapping: PropTypes.object.isRequired,
    loadingIndicator: PropTypes.element,
    children: PropTypes.any,
    initializationDone: PropTypes.func,
    nullValues: PropTypes.bool,
}

Provider.defaultProps = {
    loadingIndicator: <DefaultLoadingIndicator />,
    initializationDone: () => {},
    nullValues: false,
}

export default Provider;