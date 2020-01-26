import React from 'react';
import StorageManager from '../Manager/StorageManager';
import StorageListener from '../Entity/StorageListener';
import throwError from '../Service/ErrorService';

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
             * @type {Array<StorageListener>}
             */
            _events = [];

            constructor(props) {
                super(props);
                if (propsToBind.length > 0) {
                    for (let i = 0; i < propsToBind.length; i++) {
                        const _value = propsToBind[i];
                        const _propname = (typeof _value === 'object' && _value.name) ? _value.name : _value;
                        const _sync = (typeof _value === 'object' && _value.sync) ? _value.sync : false;
                        if (!StorageManager.propnameExists(_propname)) {
                            throwError(`The given propname "${_propname}" does not exist.`);
                        }
                        const _componentname = WrappedComponent.name;
                        // set prop as state
                        this.state[_propname] = StorageManager.getDataByProp(_propname);
                        if (_sync) {
                            this._events.push(
                                new StorageListener(
                                    _propname,
                                    _componentname,
                                    WrappedComponent,
                                    this.updateData
                                )
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
                // register listener
                for (let i = 0; i < this._events.length; i++) {
                    StorageManager.addStorageListener(this._events[i]);
                }
            }

            componentWillUnmount() {
                // remove listener
                for (let i = 0; i < this._events.length; i++) {
                    StorageManager.removeStorageListener(this._events[i]);
                }
            }

            updateData = (listener, value) => {
                
                console.log(`updateData(${WrappedComponent.name})`, {
                    listener,
                    value,
                    prevvalue: this.state[listener.propname],
                });
                
                this.forceUpdate();
                
                // 1. check if value has changed
                // 2. update props
                // 3. Rerender UI (prevent child from rerendering)
            }
        }

        SubscriptionComponent.displayName = `SubscriptionComponent(${getDisplayName(WrappedComponent)})`;

        return React.forwardRef((props, ref) => {
            return <SubscriptionComponent {...props} forwardedRef={ref} />
        })
    }

    function getDisplayName(WrappedComponent) {
        return WrappedComponent.displayName || WrappedComponent.name || 'Component';
    }
}