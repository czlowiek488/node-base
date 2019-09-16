const Nats = require('nats');

module.exports = (connection = undefined) => {
    const nats = Nats.connect(connection);
    const accessable = {
        read: (channel, callback, options = null) => 
            nats.subscribe(channel, (response, replyTo) => callback(JSON.parse(response), replyTo), options),
        write: (channel, message, reply) => 
            new Promise((resolve) => nats.publish(channel, JSON.stringify(message), reply, resolve)),
        callInternal: (channel, message, timeout, options) => 
            nats.call(channel, {...message, postfix: 'Internal'}, timeout, options),
        close: channelId =>
            nats.unsubscribe(channelId),
        push: (channel, action_id, payload) =>
            nats.write(channel, { action_id, payload }),
        call: (channel, message, timeout = 5000, options = {}) =>
            new Promise((resolve, reject) => 
                nats.requestOne(channel, JSON.stringify(message), options, timeout, response => 
                        response instanceof Nats.NatsError
                            ? resolve(JSON.parse(response))
                            : reject(response))),
    };
    return Object.freeze(accessable);
}