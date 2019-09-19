const { compare, basic: { isFunction } } = require('../../core/validator');
const { driverError } = require('../../core/error');
const fake_setex = store => async (key, value, time) => {
    await store.set(key, value);
    setTimeout(() => store.delete(key), time);
};
module.exports = (store, { force_json = false } = { force_string_values: false, force_string_keys: false }) => {
    const compare_result = compare.onKeys(store, 'some', ['get', 'set', 'delete'], isFunction);
    if (compare_result !== true) {
        throw driverError('KeyValueStore', `Initialization failed!`, compare_result);
    }
    if (!isFunction(store['setex'])) {
        store['setex'] = fake_setex(store);
    }
    const parseResponse = response =>
        Promise.resolve(!!force_json ? JSON.parse(response) : response);
    const parseKey = key => {
        if (!!force_json) {
            return JSON.stringify(value);
        };
        return key;
    }
    const parseValue = value => {
        if (!!force_json) {
            return JSON.stringify(value);
        }
        return value;
    }
    const accessable = {
        /**
         * @param {String|Number|Boolean} key
         * @return {Promise<any>} value assigned to key OR undefined 
         */
        get(key) { return parseResponse(store.get(parseKey(key))) },
        /**
         * @param {String|Number|Boolean} key 
         * @param {any} value
         * @return {Promise<undefined>};
         * @description assign value to key
         */
        set(key, value) { return parseResponse(store.set(parseKey(key), parseValue(value))) },
        /**
         * @param {String|Number|Boolean} key
         * @return {Promise<undefined>}
         * @description delete key and value assigned to key 
         */
        delete(key) { return parseResponse(store.delete(parseKey(key), parseValue(value))) },
        /**
         * @param {String|Number|Boolean} key 
         * @param {any} value 
         * @param {Number} time
         * @return {Promise<undefined>}
         * @description assign value to key then, after provided time delete value
         */
        setex(key, value, time) { return parseResponse(store.setex(parseKey(key), parseValue(value), time)) },
    };
    return Object.freeze(accessable);
};