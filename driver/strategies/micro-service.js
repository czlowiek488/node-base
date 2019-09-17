const Compare = require('../../core/validator/compare');

module.exports = ({ errorHandler, MessageBroker }) => async ({ family, name, Model }) => {
    const compare_result = Compare.many([
        Compare.onKeys({ family, name }, 'some', ['family', 'name'], value => typeof value !== 'string'),
        Compare.onKeys({ errorHandler }, 'some', ['errorHandler'], value => !(value instanceof Function))
    ]);
    if (compare_result !== true) {
        throw Error(`MICRO-SERVICE INITIALIZATION FAILED! ${compare_result}`)
    }
    const service_id = `${family}.${name}`;
    const model = await Model({
        name,
        family,
        requestInternal: (channel_id, message) => MessageBroker.request(channel_id, message),
        publishInternal: (channel_id, message) => MessageBroker.publish(channel_id, message),
    });
    if (!(model instanceof Object) || model.constructor.name !== 'Object') errorHandler(Error(`Model initalization failed for ${service_id}`))
    const { logic = {}, eventHandler = () => { } } = model;
    eventHandler({ event: 'starting', family, name, message: `Starting {${service_id}} MicroService...` });
    const requestHandler = async (request, replyTo) => {
        try {
            const { endpoint, data } = request;
            if (!(logic[endpoint] instanceof Function)) errorHandler(Error(`EndpointIsMissing - ${request} - ${Object.keys(logic)}`));
            const result = await logic[endpoint](data);
            eventHandler({ event: 'request', family, name, message: `Request for {${name}.${endpoint}(${result}})` });
            await MessageBroker.publish(replyTo, result);
        } catch (e) {
            errorHandler({ event: 'error', family, name, request, error: e })
            if (replyTo !== undefined) await MessageBroker.publish(replyTo, { success: false, error_name: e.name })
        }
    }
    MessageBroker.subscribe(service_id, requestHandler);
    eventHandler({ event: 'running', family, name, message: `Running {${service_id}} MicroService...` });
}