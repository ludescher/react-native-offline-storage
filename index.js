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

async function purgestorage() {
    return await StorageManager.purgestorage();
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
 * @param {*} value 
 */
async function remove(key, value = null) {
    StorageManager.remove(key, value);
}

/**
 * 
 * @param {String} key 
 * @param {String} propname 
 * @param {String} sortname 
 */
function sort(key, propname, sortname) {
    StorageManager.sort(key, propname, sortname);
}

/**
 * 
 * @param {String} key 
 */
async function reset(key) {
    StorageManager.reset(key);
}

/**
 * 
 * @param {String} key 
 */
async function clear(key = null) {
    await StorageManager.clear(key);
}

export { registerEntity, Entity, UnloadedValue, clear, purgestorage, reset, Provider, connect, LinkedDataTransformer, save, load, remove, sort };