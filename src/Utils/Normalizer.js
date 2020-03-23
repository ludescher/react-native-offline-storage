import DataTypes from './DataTypes';
import HydraError from '../Entity/HydraError';
import ConstraintViolationList from '../Entity/ConstraintViolationList';
import UnloadedValue from '../Entity/UnloadedValue';

class DataNormalizer {
    static supportsNormalization(data, type) {
        throw 'Not Implemented';
    }

    static supportsDenormalization(data, type) {
        throw 'Not Implemented';
    }

    static normalize(data, type, options, internalOptions) {
        throw 'Not Implemented';
    }

    static denormalize(data, type, options, internalOptions) {
        throw 'Not Implemented';
    }
}

class DateTimeNormalizer extends DataNormalizer {
    static supportsNormalization(data, type) {
        return data instanceof Date;
    }

    static supportsDenormalization(data, type) {
        return type == 'DateTime' || type == 'Date';
    }

    static normalize(data, type, options, internalOptions) {
        return data.getTime() / 1000;
    }

    static denormalize(data, type, options, internalOptions) {
        return new Date(data * 1000);
    }
}

class EntityNormalizer extends DataNormalizer {
    static loadedEntitys = {};

    static registeredEntities = [];

    static addEntity(type, name) {
        this.registeredEntities.push({
            'typename': type.Iri || name,
            'type': type,
        });
    }

    static getByEntityId(id) {
        return this.loadedEntitys[id] ?? null;
    }

    static isTypenameRegistered(name) {
        let registered = this.registeredEntities.find(t => name === t.typename)
        return registered ? true : false;
    }

    static isTypeRegistered(data) {
        let registered = this.registeredEntities.find(t => data === t.type)
        return registered ? true : false;
    }

    static getType(name) {
        return this.registeredEntities.find(t => t.typename == name).type;
    }

    static getTypeName(data) {
        let registered = this.registeredEntities.find(t => data instanceof t.type)
        return registered ? registered.typename : null;
    }

    static supportsNormalization(data, type) {
        return (this.registeredEntities.find(t => data instanceof t.type) != null);
    }

    static supportsDenormalization(data, type) {
        let mytype = type || data['@type'];
        return (this.registeredEntities.find(t => t.typename == mytype) != null);
    }

    static normalizeUnloaded(data, type, options, internalOptions) {
        return data.entityId;
    }

    static normalize(data, type, options, internalOptions) {
        if (internalOptions.entityDepth > options.maxEntityDepth && data.entityId != null) {
            return this.normalizeUnloaded(data, type, options, internalOptions);
        }

        let obj = {};
        obj['@type'] = type;
        obj['@id'] = data.entityId;
        
        let etype = this.getType(type);

        for (const key in etype.TypeMap) {
            const prop = data[key];

            if (!(prop instanceof UnloadedValue)) {
                obj[key] = LinkedDataTransformer._internalNormalize(prop, options, {
                    forcedType: etype.TypeMap[key],
                    entityDepth: internalOptions.entityDepth,
                });
            }
        }
        return obj;
    }

    static denormalizeUnloaded(data, type, options, internalOptions) {
        let eid = data['@id'];
        if (eid && eid in this.loadedEntitys) {
            return this.loadedEntitys[eid];
        } else {
            let etype = this.getType(type);
            let unloaded = new etype();
            unloaded.entityId = eid;
            if (unloaded.entityId) {
                this.loadedEntitys[unloaded.entityId] = unloaded;
            }
            return unloaded;
        }
    }

    static denormalize(data, type, options, internalOptions) {
        if (typeof(data) == 'string') {
            return this.denormalizeUnloaded({'@id': data}, type, options, internalOptions);
        } else {
            if (internalOptions.entityDepth > options.maxEntityDepth) {
                return this.denormalizeUnloaded(data, type, options, internalOptions);
            }

            let etype = this.getType(type);
            let newclass = new etype();
            newclass.entityId = data['@id'];

            for (const key in etype.TypeMap) {
                if (key in data) {
                    const prop = data[key];
                    let val = LinkedDataTransformer._internalDenormalize(prop, options, {
                        forcedType: etype.TypeMap[key],
                        entityDepth: internalOptions.entityDepth,
                    });

                    newclass[key] = val;
                }
            }

            if (newclass.entityId) {
                if (newclass.entityId in this.loadedEntitys) {
                    let loaded = this.loadedEntitys[newclass.entityId];
                    if (options.allowCacheOverwrite) {
                        loaded.applyData(newclass);
                    }
                    return loaded;
                }
                this.loadedEntitys[newclass.entityId] = newclass;
            }

            return newclass;
        }
    }
}

class CollectionNormalizer extends DataNormalizer {
    static supportsNormalization(data, type) {
        return Array.isArray(data) || type.startsWith(DataTypes.array) || type.startsWith(DataTypes.object);
    }

    static supportsDenormalization(data, type) {
        return ((typeof(data['@type']) != 'undefined') && (data['@type'] == 'hydra:Collection')) || type.startsWith(DataTypes.array) || type.startsWith(DataTypes.object);
    }

    static normalize(data, type, options, internalOptions) {
        let childs;
        
        let typestart = type.indexOf('<');
        let typeend = type.lastIndexOf('>');
        let basetype = type;
        let subtype = null;
        if (typestart >= 0 && typeend >= 0) {
            subtype = type.substring(typestart + 1, typeend);
            basetype = type.substring(0, typestart);
        }

        switch (basetype) {
            case DataTypes.array: {
                childs = [];
                for (const key in data) {
                    if (subtype) {
                        internalOptions.forcedType = subtype;
                    }
                    childs[key] = LinkedDataTransformer._internalNormalize(data[key], options, internalOptions);
                }
                break;
            }

            case DataTypes.object:
            default: {
                childs = {};
                for (const key in data) {
                    if (subtype) {
                        internalOptions.forcedType = subtype;
                    }
                    childs[key] = LinkedDataTransformer._internalNormalize(data[key], options, internalOptions);
                }
                break;
            }
        }

        return childs;
    }

    static denormalize(data, type, options, internalOptions) {
        let childs;
        
        let typestart = type.indexOf('<');
        let typeend = type.lastIndexOf('>');
        let basetype = type;
        let subtype = null;
        if (typestart >= 0 && typeend >= 0) {
            subtype = type.substring(typestart + 1, typeend);
            basetype = type.substring(0, typestart);
        }

        switch (basetype) {
            case 'hydra:Collection': {
                childs = [];
                for (const key in data['hydra:member']) {
                    if (subtype) {
                        internalOptions.forcedType = subtype;
                    }
                    childs[key] = LinkedDataTransformer._internalDenormalize(data['hydra:member'][key], options, internalOptions);
                }
                break;
            }

            case DataTypes.array: {
                childs = [];
                for (const key in data) {
                    if (subtype) {
                        internalOptions.forcedType = subtype;
                    }
                    childs[key] = LinkedDataTransformer._internalDenormalize(data[key], options, internalOptions);
                }
                break;
            }

            case DataTypes.object:
            default: {
                childs = {};
                for (const key in data) {
                    if (subtype) {
                        internalOptions.forcedType = subtype;
                    }
                    childs[key] = LinkedDataTransformer._internalDenormalize(data[key], options, internalOptions);
                }
                break;
            }
        }

        return childs;
    }
}

class ErrorNormalizer extends DataNormalizer {
    static supportsNormalization(data, type) {
        return data instanceof HydraError;
    }

    static supportsDenormalization(data, type) {
        return (typeof(data['@type']) != 'undefined') && (data['@type'] == 'hydra:Error');
    }

    static normalize(data, type, options, internalOptions) {
        throw 'Not Supported';
    }

    static denormalize(data, type, options, internalOptions) {
        return new HydraError(data['hydra:title'], data['hydra:description'], data['trace']);
    }
}

class ConstraintViolationListNormalizer extends DataNormalizer {
    static supportsNormalization(data, type) {
        return data instanceof ConstraintViolationList;
    }

    static supportsDenormalization(data, type) {
        return (typeof(data['@type']) != 'undefined') && (data['@type'] == 'ConstraintViolationList');
    }

    static normalize(data, type, options, internalOptions) {
        throw 'Not Supported';
    }

    static denormalize(data, type, options, internalOptions) {
        return new ConstraintViolationList(data['hydra:title'], data['hydra:description'], data['violations']);
    }
}

class LinkedDataTransformer {
    static _DataNormalizers = [];

    /**
     * 
     * @param {{new(): DataNormalizer}} type 
     */
    static registerDataNormalizer(type) {
        if (type.prototype instanceof DataNormalizer) {
            this._DataNormalizers.push(type);
        } else {
            throw 'Type must be child of [DataNormalizer]';
        }
    }

    /**
     * Gets a registered Entity Type from its name
     * 
     * @param {String} classname 
     * @returns {{new(): Entity}}
     */
    static getEntityType(classname) {
        return EntityNormalizer.getType(classname);
    }

    /**
     * 
     * @param {*} extdata 
     * @param {Object} options 
     * @param {*} options.forcedType
     * @param {Number} options.maxEntityDepth
     */
    static denormalize(extdata, options = {}) {
        options = Object.assign({
            forcedType: null,
            maxEntityDepth: Number.POSITIVE_INFINITY,
            allowCacheOverwrite: true,
        }, options);

        return this._internalDenormalize(extdata, options, {
            forcedType: options.forcedType,
            entityDepth: 0,
        });
    }

    static _internalDenormalize(extdata, options = {}, internalOptions = {}) {
        if (extdata == null) {
            return null;
        }

        let typename;
        if (typeof(extdata) == 'object' && typeof(extdata['@type']) != 'undefined') {
            typename = extdata['@type'];
        } else {
            typename = EntityNormalizer.getTypeName(extdata) || extdata.constructor.name;
        }

        if (internalOptions.forcedType) {
            typename = internalOptions.forcedType;
            delete internalOptions.forcedType;
        }

        let newoptions = this.cloneOptions(internalOptions);

        for (const normalizer of this._DataNormalizers) {
            if (normalizer.supportsDenormalization(extdata, typename)) {
                newoptions.entityDepth++;
                return normalizer.denormalize(extdata, typename, options, newoptions);
            }
        }

        return extdata;
    }

    /**
     * 
     * @param {*} mydata 
     * @param {Object} options 
     * @param {*} options.forcedType
     * @param {Number} options.maxEntityDepth
     */
    static normalize(mydata, options = {}) {
        options = Object.assign({
            forcedType: null,
            maxEntityDepth: Number.POSITIVE_INFINITY,
        }, options);

        return this._internalNormalize(mydata, options, {
            forcedType: options.forcedType,
            entityDepth: 0,
        });
    }

    static _internalNormalize(mydata, options = {}, internalOptions = {}) {
        options = Object.assign({
            forcedType: null,
        }, options);

        if (mydata == null) {
            return null;
        }

        let typename = EntityNormalizer.getTypeName(mydata) || mydata.constructor.name;

        if (internalOptions.forcedType) {
            typename = internalOptions.forcedType;
            delete internalOptions.forcedType;
        }

        let newoptions = this.cloneOptions(internalOptions);
        
        for (const normalizer of this._DataNormalizers) {
            if (normalizer.supportsNormalization(mydata, typename)) {
                newoptions.entityDepth++;
                return normalizer.normalize(mydata, typename, options, newoptions);
            }
        }

        return mydata;
    }

    static cloneOptions(options) { // cause js does not support pass by value since it doesnt support structs. classic horseshit language
        return JSON.parse(JSON.stringify(options));
    }
}

LinkedDataTransformer.registerDataNormalizer(EntityNormalizer);
LinkedDataTransformer.registerDataNormalizer(CollectionNormalizer);
LinkedDataTransformer.registerDataNormalizer(ErrorNormalizer);
LinkedDataTransformer.registerDataNormalizer(ConstraintViolationListNormalizer);
LinkedDataTransformer.registerDataNormalizer(DateTimeNormalizer);

export { DataNormalizer, DateTimeNormalizer, EntityNormalizer, CollectionNormalizer, ErrorNormalizer, ConstraintViolationListNormalizer, LinkedDataTransformer }