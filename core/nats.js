const Nats = require('nats');

module.exports = (connection = undefined) => {
    const nats = Nats.connect(connection);
    const accessable = {
        subscribe(channel, callback, options = null) {
            return nats.subscribe(channel, (response, replyTo) => callback(response, replyTo), options)
        },
        unsubscribe(channelId) {
            return nats.unsubscribe(channelId)
        },
        publish(channel, message) {
            return new Promise(resolve => nats.publish(channel, message, resolve))
        },
        request(channel, message, timeout = 5000, options = {}) {
            return new Promise((resolve, reject) =>
                nats.requestOne(channel, message, options, timeout, response =>
                    response instanceof Nats.NatsError
                        ? resolve(response)
                        : reject(response)))
        },
    };
    return Object.freeze(accessable);
}