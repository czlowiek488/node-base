const Compare = require('../../core/validator/compare');
module.exports = (broker, { json = false } = { json: false }) => {
    const compare_result = Compare.onKeys(broker, 'some', ['subscribe', 'unsubscribe', 'publish', 'request'], value => !(value instanceof Function));
    if (compare_result !== true) {
        throw Error(`MESSAGE-BROKER INITIALIZATION FAILED! ${JSON.stringify(compare_result)}`);
    }
    const fromJSON = string => !!json ? JSON.parse(string) : string;
    const toJSON = obj => !!json ? JSON.stringify(obj) : obj;
    const accessable = {
        subscribe(channel_id, callback, ...rest) { return broker.subscribe(channel_id, (message, ...callback_rest) => callback(fromJSON(message), ...callback_rest), ...rest) },
        unsubscribe(channel_id, ...rest) { return broker.unsubscribe(channel_id, ...rest) },
        publish(channel_id, message, ...rest) { return broker.publish(channel_id, toJSON(message), ...rest) },
        request(channel_id, message, ...rest) { return broker.request(channel_id, toJSON(message), ...rest).then(fromJSON) },
    };
    return Object.freeze(accessable);
};