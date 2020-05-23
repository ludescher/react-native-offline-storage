import React from 'react';
import hoistStatics from 'hoist-non-react-statics';

export function mvc(Controller) {
    if (!Controller) {
        throw new Error('Controller cannot not be null');
    }
    return (WrappedComponent) => {
        if (!WrappedComponent) {
            throw new Error('WrappedComponent has to be of type React.Component');
        }
        class MVCComponent extends React.Component {

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
            return <MVCComponent {...props} forwardedRef={ref} />
        });

        _forwarded.displayName = `MVCComponent(${getDisplayName(WrappedComponent)})`;
        _forwarded.WrappedComponent = WrappedComponent;

        return hoistStatics(_forwarded, WrappedComponent);
    }

    function getDisplayName(WrappedComponent) {
        return WrappedComponent.displayName || WrappedComponent.name || 'Component';
    }
}

export default mvc;