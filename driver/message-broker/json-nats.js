const MessageBroker = require('../strategies/message-broker');
const { basic: { isIstance } } = require('../../core/validator')
const Nats = require('nats');

module.exports = ({ address, logging } = {}) => {
    const nats = Nats.connect(address);
    return MessageBroker({
        subscribe: (channel, callback, options = null) =>
            nats.subscribe(channel, (response, replyTo) => callback(response, replyTo), options),
        unsubscribe: (channelId) =>
            nats.unsubscribe(channelId),
        publish: (channel, message) =>
            new Promise(resolve => nats.publish(channel, message, resolve)),
        request: (channel, message, timeout = 5000, options = {}) =>
            new Promise((resolve, reject) =>
                nats.requestOne(channel, message, options, timeout, response =>
                    isIstance(response, Nats.NatsError)
                        ? reject(response)
                        : resolve(response))),
    }, {
        json: true,
        logging
    })
};