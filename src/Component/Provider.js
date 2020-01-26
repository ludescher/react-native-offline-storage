import React from 'react';
import PropTypes from 'prop-types';
import DefaultLoadingIndicator from './DefaultLoadingIndicator';
import StorageManager from '../Manager/StorageManager';
import throwError from '../Service/ErrorService';

class Provider extends React.Component {
    state = {
        initialized: false
    };
    
    constructor(props) {
        super(props);
        this.initialize(props);
    }

    render() {
        return (this.state.initialized) ? this.props.children : this.props.loadingIndicator;
    }

    initialize = async (props) => {
        if (typeof props.mapping === 'object') {
            await StorageManager.initialize(props.mapping);
            props.initializationDone(StorageManager._storage);
            this.setState({
                initialized: true,
            });
        } else {
            throwError("mapping should be of type object !");
        }
    }
}
  
Provider.propTypes = {
    mapping: PropTypes.object.isRequired,
    loadingIndicator: PropTypes.element,
    children: PropTypes.any,
    initializationDone: PropTypes.func,
}

Provider.defaultProps = {
    loadingIndicator: <DefaultLoadingIndicator />,
    initializationDone: () => {}
}

export default Provider;