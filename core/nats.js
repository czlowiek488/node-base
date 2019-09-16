const Nats = require('nats');

module.exports = (connection = undefined) => {
    const nats = Nats.connect(connection);
    const accessable = {
        subscribe(channel, callback, options = null) {
            return nats.subscribe(channel, (response, replyTo) => callback(JSON.parse(response), replyTo), options)
        },
        unsubscribe(channelId) {
            return nats.unsubscribe(channelId)
        },
        publish(channel, message, reply) {
            return new Promise((resolve) => nats.publish(channel, JSON.stringify(message), reply, resolve))
        },
        request(channel, message, timeout = 5000, options = {}) {
            return new Promise((resolve, reject) =>
                nats.requestOne(channel, JSON.stringify(message), options, timeout, response =>
                    response instanceof Nats.NatsError
                        ? resolve(JSON.parse(response))
                        : reject(response)))
        },
    };
    return Object.freeze(accessable);
}