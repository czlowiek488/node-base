const Nats = require('nats');

module.exports = (connection = undefined) => {
    const nats = Nats.connect(connection);
    const accessable = {
        read(channel, callback, options = null) { 
            return nats.subscribe(channel, (response, replyTo) => callback(JSON.parse(response), replyTo), options)},
        write(channel, message, reply) {
            return new Promise((resolve) => nats.publish(channel, JSON.stringify(message), reply, resolve))},
        callInternal(channel, message, timeout, options) {
            return nats.call(channel, {...message, postfix: 'Internal'}, timeout, options)},
        close(channelId) {
            return nats.unsubscribe(channelId)},
        push(channel, action_id, payload) {
            return nats.write(channel, { action_id, payload })},
        call(channel, message, timeout = 5000, options = {}) {
            return new Promise((resolve, reject) => 
                nats.requestOne(channel, JSON.stringify(message), options, timeout, response => 
                        response instanceof Nats.NatsError
                            ? resolve(JSON.parse(response))
                            : reject(response)))},
    };
    return Object.freeze(accessable);
}