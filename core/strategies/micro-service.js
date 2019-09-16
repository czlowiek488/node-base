module.exports = ({ errorHandler, MessageBroker }) => ({ log, family }) => ({ name, logic }) => {
    const service_id = `${family}.${name}`;
    log({ event: 'start', family, name, message: `Starting {${service_id}} MicroService...` });
    const requestHandler = async request => {
        const { endpoint, data, replyTo } = JSON.parse(request);
        const result = await logic[endpoint](data).catch(errorHandler);
        log({ event: 'request', family, name, message: `Request for {${name}.${endpoint}(${JSON.stringify(result)}})` });
        await MessageBroker.publish(replyTo, JSON.stringify(result))
    }
    MessageBroker.subscribe(service_id, requestHandler)
}