const { compare, basic: { isFunction } } = require('../../core/validator');
const { driverError } = require('../../core/error');
const logger = require('../../core/logger');
module.exports = (broker, { json = false, logging = false } = { json: false, logging: false }) => {
    const compare_result = compare.onKeys(broker, 'some', ['subscribe', 'unsubscribe', 'publish', 'request'], isFunction);
    if (compare_result !== true) {
        throw driverError(`MESSAGE-BROKER INITIALIZATION FAILED!`, compare_result);
    }
    const fromJSON = string => !!json ? JSON.parse(string) : string;
    const toJSON = obj => !!json ? JSON.stringify(obj) : obj;
    const log = (...args) => logging === true ? logger.driver('MessageBroker', ...args) : null;
    const accessable = {
        /**
         * @param {String} channel_id 
         * @param {Function} eventHandler
         * @return {Promise<undefined>}
         * @description subscribe to channel
         */
        subscribe(channel_id, eventHandler) { return log('sub', { channel_id }) || Promise.resolve(broker.subscribe(channel_id, (message, ...callback_rest) => eventHandler(fromJSON(message), ...callback_rest))) },
        /**
         * @param {String} channel_id 
         * @return {Promise<undefined>}
         * @description unsubscribe channel
         */
        unsubscribe(channel_id) { return log('unsub', { channel_id }) || Promise.resolve(broker.unsubscribe(channel_id)) },
        /**
         * @param {String} channel_id 
         * @param {String|Buffer|{}} message
         * @return {Promise.resolve<undefined>}
         * @description publish to channel
         */
        publish(channel_id, message) { return log('pub', { channel_id }) || Promise.resolve(broker.publish(channel_id, toJSON(message))) },
        /**
         * @param {String} channel_id
         * @param {String|Buffer|{}} message
         * @return {Promise.resolve<String|Buffer|{}>}
         * @description request to channel
         */
        request(channel_id, message) { return log('req', { channel_id }) || Promise.resolve(broker.request(channel_id, toJSON(message))).then(fromJSON) },
    };
    return Object.freeze(accessable);
};