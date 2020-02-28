import Entity from './src/Entity/Entity';
import UnloadedValue from './src/Entity/UnloadedValue';
import * as Normalizer from './src/Utils/Normalizer';
import StorageManager from './src/Manager/StorageManager';
import Provider from './src/Component/Provider';
import { connect } from './src/Utils/Connect';
import { LinkedDataTransformer } from './src/Utils/Normalizer';

/**
 * 
 * @param {Entity} entity 
 * @param {String} classname 
 */
function registerEntity(entity, classname) {
    Normalizer.EntityNormalizer.addEntity(entity, classname);
}

async function clearAll() {
    return await StorageManager.clearAll();
}

/**
 * 
 * @param {String} key
 * @returns {*}
 */
function load(key = null) {
    return StorageManager.load(key);
}

/**
 * 
 * @param {String} key 
 * @param {*} value 
 */
async function save(key, value = null) {
    StorageManager.save(key, value);
}

/**
 * 
 * @param {String} key 
 */
async function clear(key = null) {
    await StorageManager.clear(key);
}

export { registerEntity, Entity, UnloadedValue, clear, clearAll, Provider, connect, LinkedDataTransformer, save, load };