const Compare = require('../../core/validator/compare');
module.exports = (broker, { json = false } = { json: false }) => {
    const compare_result = Compare.onKeys(broker, 'some', ['subscribe', 'unsubscribe', 'publish', 'request'], value => !(value instanceof Function));
    if (compare_result !== true) {
        throw Error(`MESSAGE-BROKER INITIALIZATION FAILED! ${JSON.stringify(compare_result)}`);
    }
    const accessable = {
        subscribe(channel_id, callback, ...rest) { return broker.subscribe(channel_id, (message, replyTo) => callback(!!json ? JSON.parse(message) : message, replyTo), ...rest) },
        unsubscribe(channel_id, ...rest) { return broker.unsubscribe(channel_id, ...rest) },
        publish(channel_id, message, ...rest) { return broker.publish(channel_id, !!json ? JSON.stringify(message) : message, ...rest) },
        request(channel_id, message, ...rest) { return broker.request(channel_id, !!json ? JSON.stringify(message) : message, ...rest).then(result => !!json ? JSON.parse(result) : result) },
    };
    return Object.freeze(accessable);
};