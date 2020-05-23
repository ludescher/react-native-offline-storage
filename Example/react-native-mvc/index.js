import React from 'react';

export function mvc(Controller) {
    if (!(Logic instanceof AbstractComponentLogic)) {
        throw new Error('Logic has to be of type AbstractComponentLogic');
    }
    return (WrappedComponent) => {
        if (!(WrappedComponent instanceof React.Component)) {
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

export default BindLogic;