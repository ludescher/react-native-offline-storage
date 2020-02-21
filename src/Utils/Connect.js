import React from 'react';
import StorageManager from '../Manager/StorageManager';
import StorageListener from '../Entity/StorageListener';
import throwError from '../Service/ErrorService';
import hoistStatics from 'hoist-non-react-statics';

export function connect(propsToBind = []) {
    if (!(propsToBind instanceof Array)) {
        throwError('propsToBind should be of type array.');
    }
    return (WrappedComponent = null) => {
        if (!WrappedComponent) {
            throwError('WrappedComponent cannot be null');
        }
        class SubscriptionComponent extends React.Component {
            /**
             * @type {Object}
             */
            state = {};

            /**
             * @type {StorageListener}
             */
            _event = null;

            constructor(props) {
                super(props);
                if (propsToBind.length > 0) {
                    for (let i = 0; i < propsToBind.length; i++) {
                        const _value = propsToBind[i];
                        const _key = (typeof _value === 'object' && _value.name) ? _value.name : _value;
                        const _sync = (typeof _value === 'object' && _value.sync) ? _value.sync : false;
                        if (!StorageManager.keyExists(_key)) {
                            throwError(`The given key "${_key}" does not exist.`);
                        }
                        const _componentname = WrappedComponent.name;
                        // set prop as state
                        this.state[_key] = StorageManager.getDataByProp(_key);
                        if (_sync) {
                            this._event = new StorageListener(
                                _key,
                                _componentname,
                                WrappedComponent,
                                this.updateData
                            );
                        }
                    }
                }
            }

            render() {
                // check all states for UnloadedValues
                // if UnloadedValues exist => renderLoadingComponent
                // make Entity call for updated Data (to replace UnloadedValues)
                // if all UnloadedValues are resolved => renderWrappedComponent

                return this.renderWrappedComponent();
            }

            renderLoadingComponent = () => {
                return null;
            }

            renderWrappedComponent = () => {
                const {forwardedRef, ...props} = this.props;
                return <WrappedComponent ref={forwardedRef} {...props} {...this.state} />
            }

            componentDidMount() {
                StorageManager.addStorageListener(this._event);
            }

            componentWillUnmount() {
                StorageManager.removeStorageListener(this._event);
            }

            updateData = (listener, value) => {
                this.forceUpdate();
            }
        }
        
        const _forwarded = React.forwardRef((props, ref) => {
            return <SubscriptionComponent {...props} forwardedRef={ref} />
        });

        _forwarded.displayName = `SubscriptionComponent(${getDisplayName(WrappedComponent)})`;
        _forwarded.WrappedComponent = WrappedComponent;

        return hoistStatics(_forwarded, WrappedComponent);
    }

    function getDisplayName(WrappedComponent) {
        return WrappedComponent.displayName || WrappedComponent.name || 'Component';
    }
}