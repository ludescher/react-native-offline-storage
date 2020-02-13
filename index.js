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

function storage() {
    return StorageManager._storage;
}

/**
 * 
 * @param {String} propname 
 * @param {*} value 
 */
async function store(propname, value) {
    if (typeof propname === 'string' && propname.length > 0) {
        if (value) {
            return await StorageManager.store(propname, value);
        } else {
            throwError('value cannot be null.');
        }
    } else {
        throwError('propname should be of type String!');
    }
}

export { registerEntity, Entity, UnloadedValue, resetStorage, storage, Provider, store, connect, LinkedDataTransformer };