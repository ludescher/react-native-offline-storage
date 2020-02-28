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
        for (let key in StorageManager._mapping) {
            let _type = StorageManager._internalCheckPropType(StorageManager._mapping[key]);
            let _value = await StorageManager._internalRehydrate(key);
            if (_value) {
                StorageManager._storage[key] = _value;
            } else {
                let _default = null;
                if (_type === DataTypes.array) {
                    _default = [];
                } else if (!nullValues) {
                    const _entity = EntityNormalizer.getType(_type);
                    _default = new _entity();
                }
                StorageManager._storage[key] = _default;
            }
        }
    }

    /**
     * 
     * @param {String} key 
     * @returns {*}
     */
    static load(key) {
        return (key !== null) ? StorageManager.getDataByProp(key) : StorageManager._storage;
    }

    /**
     * 
     * @param {String} key 
     * @param {*} value 
     */
    static async save(key, value = null) {
        if (typeof key !== 'string') {
            throwError('key should be of type String!');
        }
        if (!StorageManager._storage) {
            throwError('Storage has not been initialized, you need a Provider-Component.');
        }
        if (!StorageManager._storage.hasOwnProperty(key)) {
            throwError(`The given key "${key}" does not exists!`);
        }
        if (value) {
            return await StorageManager._internalSave(key, value);
        } else {
            return await StorageManager._internalShallowSave(key);
        }
    }

    /**
     * 
     * @param {String} key 
     * @param {*} value 
     */
    static async _internalSave(key, value) {
        let _type = StorageManager._internalCheckPropType(StorageManager._mapping[key]);
        if (_type === DataTypes.array) {
            if (value && (value instanceof Array)) {
                for (let i = 0; i < value.length; i++) {
                    let _value = value[i];
                    let _index = inArray(StorageManager._storage[key], 'id', _value.id, true);
                    if (_index >= 0) {
                        StorageManager._storage[key][_index] = _value;
                    } else {
                        StorageManager._storage[key].push(_value);
                    }
                }
            } else {
                let _index = inArray(StorageManager._storage[key], 'id', value.id, true);
                if (_index >= 0) {
                    StorageManager._storage[key][_index] = value;
                } else {
                    StorageManager._storage[key].push(value);
                }
            }
        } else {
            StorageManager._storage[key] = value;
        }
        await StorageManager._internalPersist(key, StorageManager._storage[key]);
        StorageManager.emit(key);
        return true;
    }

    /**
     * 
     * @param {String} key 
     */
    static async _internalShallowSave(key) {
        await StorageManager._internalPersist(key, StorageManager._storage[key]);
        StorageManager.emit(key);
        return true;
    }

    /**
     * clear all existing data from storage and re-initialize
     */
    static async clearAll() {
        if (StorageManager._storage) {
            // clear all data from storage
            for (let key in StorageManager._storage) {
                await StorageManager._internalClearStorageData(key)
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
        await StorageManager.initialize(StorageManager._mapping);
        return true;
    }

    /**
     * 
     * @param {String} key 
     */
    static async clear(key) {
        if (!key) {
            throwError('clear(key) key: cannot not be null!');
        }
        if (StorageManager._storage) {
            await StorageManager._internalClearStorageData(key)
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

    /**
     * 
     * @param {String} key 
     * @returns {*}
     */
    static getDataByProp(key = null) {
        if (!StorageManager._storage) {
            return new UnloadedValue(key, null);
        }
        if (!key || !StorageManager._storage.hasOwnProperty(key)) {
            throwError(`The given key "${key}" does not exist.`);
            return new UnloadedValue(null, null);
        }
        return (StorageManager._storage) ? StorageManager._storage[key] : new UnloadedValue(key, StorageManager._storage);
    }

    /**
     * 
     * @param {String} key 
     */
    static keyExists(key) {
        return StorageManager._storage.hasOwnProperty(key);
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
     * @param {String} key 
     */
    static emit(key) {
        for (let i = 0; i < StorageManager._listeners.length; i++) {
            let _listener = StorageManager._listeners[i];
            if (_listener.key === key) {
                let _value = (StorageManager._storage) ? StorageManager._storage[_listener.key] : new UnloadedValue(_listener.key, StorageManager._storage);
                _listener.callback(_listener, _value);
            }
        }
    }

    /**
     * load prop from storage
     * 
     * @param {String} key
     */
    static async _internalRehydrate(key) {
        return await AsyncStorage.getItem('@' + key)
        .then((value) => {
            return LinkedDataTransformer.denormalize(JSON.parse(value));
        })
        .catch(() => {
            return undefined;
        });
    }

    /**
     * persist a key-value pair
     * 
     * @param {String} key
     * @param {*} value
     */
    static async _internalPersist(key, value) {
        return await AsyncStorage.setItem('@' + key, JSON.stringify(LinkedDataTransformer.normalize(value, {maxEntityDepth: 3})))
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
    }

    /**
     * remove storage-data by key
     * 
     * @param {String} key
     * @returns {Boolean}
     */
    static async _internalClearStorageData(key) {
        return await AsyncStorage.removeItem('@' + key)
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