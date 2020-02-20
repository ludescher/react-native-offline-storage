import AsyncStorage from '@react-native-community/async-storage';
import { inArray, generateUniqueId } from '../Utils/ArrayHelper';
import DataTypes from '../Utils/DataTypes';
import { LinkedDataTransformer, EntityNormalizer } from '../Utils/Normalizer';
import UnloadedValue from '../Entity/UnloadedValue';
import throwError from '../Service/ErrorService';

export default class StorageManager {
    /**
     * @type {Array<StorageListener>}
     */
    static _listeners = [];

    /**
     * @type {Object}
     */
    static _mapping = null;

    /**
     * @type {Object}
     */
    static _storage = null;

    /**
     * 
     * @param {Object} mapping 
     */
    static async initialize(mapping, nullValues) {
        StorageManager._mapping = mapping;
        StorageManager._storage = {};
        for (let propname in StorageManager._mapping) {
            let _type = this._internalCheckPropType(StorageManager._mapping[propname]);
            let _value = await this._internalRehydrate(propname);
            if (_value) {
                StorageManager._storage[propname] = _value;
            } else {
                let _default = null;
                if (_type === DataTypes.array) {
                    _default = [];
                } else if (!nullValues) {
                    const _entity = EntityNormalizer.getType(_type);
                    _default = new _entity();
                }
                StorageManager._storage[propname] = _default;
            }
        }
    }

    /**
     * 
     * @param {String} propname 
     * @param {*} value 
     */
    static async store(propname, value) {
        if (!StorageManager._storage) {
            throwError('Storage has not been initialized, you need a Provider-Component.');
        }
        if (!StorageManager._storage.hasOwnProperty(propname)) {
            throwError(`The given propname "${propname}" does not exists!`);
        }
        let _type = this._internalCheckPropType(StorageManager._mapping[propname]);
        if (_type === DataTypes.array) {
            if (value && (value instanceof Array)) {
                for (let i = 0; i < value.length; i++) {
                    let _value = value[i];
                    let _index = inArray(StorageManager._storage[propname], 'id', _value.id, true);
                    if (_index >= 0) {
                        StorageManager._storage[propname][_index] = _value;
                    } else {
                        StorageManager._storage[propname].push(_value);
                    }
                }
            } else {
                let _index = inArray(StorageManager._storage[propname], 'id', value.id, true);
                if (_index >= 0) {
                    StorageManager._storage[propname][_index] = value;
                } else {
                    StorageManager._storage[propname].push(value);
                }
            }
        } else {
            StorageManager._storage[propname] = value;
        }
        await this._internalPersist(propname, StorageManager._storage[propname]);
        this.emit(propname);
    }

    static async clear(key) {
        
    }

    static load(key) {
        return (key !== null) ? this.getDataByProp(key) : this._storage;
    }

    static async save(key, value = null) {
        if (typeof key !== 'string') {
            throwError('key should be of type String!');
        }
    }

    static async _internalSave(key, value) {

    }

    static async _internalShallowSave(key, value) {

    }

    /**
     * clear all existing data from storage and re-initialize
     */
    static async resetStorage() {
        if (StorageManager._storage) {
            // clear all data from storage
            for (let propname in StorageManager._storage) {
                await this._internalClearStorageData(propname)
                .then((response) => {
                    if (!response) {
                        throw response;
                    }
                })
                .catch((error) => {
                    throw error;
                })
            }
        }
        await this.initialize(StorageManager._mapping);
        return true;
    }

    /**
     * 
     * @param {String} propname 
     * @returns {*}
     */
    static getDataByProp(propname = null) {
        if (!StorageManager._storage) {
            return new UnloadedValue(propname, null);
        }
        if (!propname || !StorageManager._storage.hasOwnProperty(propname)) {
            throwError(`The given propname "${propname}" does not exist.`);
            return new UnloadedValue(null, null);
        }
        return (StorageManager._storage) ? StorageManager._storage[propname] : new UnloadedValue(propname, StorageManager._storage);
    }

    /**
     * 
     * @param {String} propname 
     */
    static propnameExists(propname) {
        return StorageManager._storage.hasOwnProperty(propname);
    }

    /**
     * 
     * @param {StorageListener} listener 
     */
    static addStorageListener(listener) {
        if (listener) {
            listener.id = generateUniqueId(StorageManager._listeners);
            StorageManager._listeners.push(listener);
        }
    }

    /**
     * 
     * @param {StorageListener} listener 
     */
    static removeStorageListener(listener) {
        if (listener) {
            if (StorageManager._listeners.length > 0) {
                let _index = inArray(StorageManager._listeners, 'id', listener.id, true);
                if (_index >= 0) {
                    StorageManager._listeners.splice(_index, 1);
                }
            }
        }
    }

    /**
     * 
     * @param {String} propname 
     */
    static emit(propname) {
        for (let i = 0; i < StorageManager._listeners.length; i++) {
            let _listener = StorageManager._listeners[i];
            if (_listener.propname === propname) {
                let _value = (StorageManager._storage) ? StorageManager._storage[_listener.propname] : new UnloadedValue(_listener.propname, StorageManager._storage);
                _listener.callback(_listener, _value);
            }
        }
    }

    /**
     * load prop from storage
     * 
     * @param {String} propname
     */
    static async _internalRehydrate(propname) {
        return await AsyncStorage.getItem('@' + propname)
        .then((value) => {
            return LinkedDataTransformer.denormalize(JSON.parse(value));
        })
        .catch(() => {
            return undefined;
        });
    }

    /**
     * persist a propname-value pair
     * 
     * @param {String} propname
     * @param {*} value
     */
    static async _internalPersist(propname, value) {
        return await AsyncStorage.setItem('@' + propname, JSON.stringify(LinkedDataTransformer.normalize(value, {maxEntityDepth: 3})))
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
    }

    /**
     * remove storage-data by propname
     * 
     * @param {String} propname
     * @returns {Boolean}
     */
    static async _internalClearStorageData(propname) {
        return await AsyncStorage.removeItem('@' + propname)
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
    }

    /**
     * 
     * @param {String} type 
     */
    static _internalCheckPropType(type) {
        let typestart = type.indexOf('<');
        let typeend = type.lastIndexOf('>');
        let basetype = type;
        if (typestart >= 0 && typeend >= 0) {
            type.substring(typestart + 1, typeend);
            basetype = type.substring(0, typestart);
        }
        return basetype;
    }
}