import React from 'react';
import hoistStatics from 'hoist-non-react-statics';

export function smartcomponent(Controller) {
    if (!Controller) {
        throw new Error('Controller cannot not be null');
    }
    return (WrappedComponent) => {
        if (!WrappedComponent) {
            throw new Error('WrappedComponent has to be of type React.Component');
        }

        // WrappedComponent.bind(new Controller());

        const test = Object.getOwnPropertyNames(Controller());

        console.log("test()", test);

        // WrappedComponent.prototype.testCall = () => {
        //     console.log("testCall()");
        // };

        console.log("WrappedComponent()", WrappedComponent);

        return WrappedComponent;
        class SmartComponent extends React.Component {

            /**
             * @type {Object}
             */
            state = {};

            /**
             * @type {Class}
             */
            controller;

            constructor(props) {
                super(props);
                this.controller = new Controller(props);
            }

            render() {
                const { forwardedRef, ...props } = this.props;
                return <WrappedComponent ref={forwardedRef} {...props} {...this.state} />
            }
        }

        const _forwarded = React.forwardRef((props, ref) => {
            return <SmartComponent {...props} forwardedRef={ref} />
        });

        _forwarded.displayName = `SmartComponent(${getDisplayName(WrappedComponent)})`;
        _forwarded.WrappedComponent = WrappedComponent;

        return hoistStatics(_forwarded, WrappedComponent);
    }

    function getDisplayName(WrappedComponent) {
        return WrappedComponent.displayName || WrappedComponent.name || 'Component';
    }
}

export default smartcomponent;