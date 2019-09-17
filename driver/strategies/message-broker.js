const Compare = require('../../core/validator/compare');
module.exports = broker => {
    const compare_result = Compare.onKeys(broker, 'some', ['subscribe', 'unsubscribe', 'publish', 'request'], value => !(value instanceof Function));
    if (compare_result !== true) {
        throw Error(`MESSAGE-BROKER INITIALIZATION FAILED! ${JSON.stringify(compare_result)}`);
    }
    const accessable = {
        subscribe(channel_id, callback, ...rest) { return broker.subscribe(channel_id, callback, ...rest) },
        unsubscribe(channel_id, ...rest) { return broker.unsubscribe(channel_id, ...rest) },
        publish(channel_id, message, ...rest) { return broker.publish(channel_id, message, ...rest) },
        request(channel_id, message, ...rest) { return broker.request(channel_id, message, ...rest) },
    };
    return Object.freeze(accessable);
};