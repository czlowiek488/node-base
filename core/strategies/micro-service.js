module.exports = ({ MessageBroker, log }) => ({ errorHandler, name, endpoints }) => {
    const private = {
        requestHandler: async request => {
            const { endpoint, data, replyTo } = JSON.parse(request);
            const result = await endpoints[endpoint](data).catch(errorHandler);
            log({ event: 'request', message: `Request for {${name}.${endpoint}(${JSON.stringify(result)}})` });
            await MessageBroker.publish(replyTo, JSON.stringify(result))
        }
    };
    const accessable = {
        start() {
            MessageBroker.subscribe(name, private.requestHandler)
            log({ event: 'start', message: `Starting {${name}} MicroService...` });
        },
        get name() { return name },
    };
    return Object.freeze(accessable);
}