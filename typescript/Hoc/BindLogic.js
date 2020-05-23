import React from 'react';
import ComponentError from '../Error/ComponentError';
import AbstractComponentLogic from '../React/AbstractComponentLogic';

function BindLogic(Controller) {

    console.log("BindLogic()", Controller);

    if (!(Logic instanceof AbstractComponentLogic)) {
        throw new ComponentError('Logic has to be of type AbstractComponentLogic');
    }

    return (WrappedComponent) => {
        if (!(WrappedComponent instanceof React.Component)) {
            throw new ComponentError('WrappedComponent has to be of type React.Component');
        }

        class LogicComponent extends React.Component {

            /**
             * @type {Object}
             */
            state = {};

            constructor(props) {
                super(props);
            }

            render() {
                const { forwardedRef, ...props } = this.props;
                return <WrappedComponent ref={forwardedRef} {...props} {...this.state} />
            }
        }

        const _forwarded = React.forwardRef((props, ref) => {
            return <LogicComponent {...props} forwardedRef={ref} />
        });

        _forwarded.displayName = `LogicComponent(${getDisplayName(WrappedComponent)})`;
        _forwarded.WrappedComponent = WrappedComponent;

        return hoistStatics(_forwarded, WrappedComponent);
    }

    function getDisplayName(WrappedComponent) {
        return WrappedComponent.displayName || WrappedComponent.name || 'Component';
    }
}

export default BindLogic;