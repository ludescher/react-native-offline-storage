import Entity from './src/Entity/Entity';
import UnloadedValue from './src/Entity/UnloadedValue';
import * as Normalizer from './src/Utils/Normalizer';
import StorageManager from './src/Manager/StorageManager';
import Provider from './src/Component/Provider';
import { connect } from './src/Utils/Connect';
import throwError from './src/Service/ErrorService';
import { LinkedDataTransformer } from './src/Utils/Normalizer';

/**
 * 
 * @param {Entity} entity 
 * @param {String} classname 
 */
function registerEntity(entity, classname) {
    Normalizer.EntityNormalizer.addEntity(entity, classname);
}

async function resetStorage() {
    return await StorageManager.resetStorage();
}

/**
 * 
 * @param {String} key
 * @returns {*}
 */
function load(key = null) {
    return (key !== null) ? StorageManager.getDataByProp(key) : StorageManager._storage;
}

/**
 * 
 * @param {String} key 
 * @param {*} value 
 */
async function save(key, value = null) {
    const _value = (value) ? value : StorageManager.getDataByProp(key);
    if (typeof key === 'string' && key.length > 0) {
        if (_value) {
            return await StorageManager.store(key, _value);
        } else {
            throwError('value cannot be null.');
        }
    } else {
        throwError('key should be of type String!');
    }
}

export { registerEntity, Entity, UnloadedValue, resetStorage, Provider, connect, LinkedDataTransformer, save, load };