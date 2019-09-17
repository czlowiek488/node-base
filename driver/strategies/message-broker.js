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
        subscribe(channel_id, callback, ...rest) { return log('sub', { channel_id }) || broker.subscribe(channel_id, (message, ...callback_rest) => callback(fromJSON(message), ...callback_rest), ...rest) },
        unsubscribe(channel_id, ...rest) { return log('unsub', { channel_id }) || broker.unsubscribe(channel_id, ...rest) },
        publish(channel_id, message, ...rest) { return log('pub', { channel_id }) || broker.publish(channel_id, toJSON(message), ...rest) },
        request(channel_id, message, ...rest) { return log('req', { channel_id }) || broker.request(channel_id, toJSON(message), ...rest).then(fromJSON) },
    };
    return Object.freeze(accessable);
};