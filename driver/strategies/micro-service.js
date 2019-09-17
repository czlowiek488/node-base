const { compare, basic: { isFunction, isString } } = require('../../core/validator');

module.exports = ({ errorHandler, MessageBroker, family, name, model }) => {
    const compare_result = compare.many([
        compare.onKeys({ family, name }, 'some', ['family', 'name'], isString),
        compare.onKeys({ errorHandler }, 'some', ['errorHandler'], isFunction)
    ]);
    if (compare_result !== true) {
        throw Error(`MICRO-SERVICE INITIALIZATION FAILED! ${JSON.stringify(compare_result)}`)
    }
    const service_id = `${family}.${name}`;

    model.eventHandler('starting', { family, name, message: `Starting {${service_id}} MicroService...` });
    const requestHandler = async (request, replyTo) => {
        try {
            const { endpoint, data } = request;
            if (!isFunction(model[endpoint])) errorHandler(Error(`EndpointIsMissing - ${request} - ${Object.keys(model)}`));
            const result = await model[endpoint](data);
            model.eventHandler('request', { family, name, message: `Request for {${name}.${endpoint}(${result}})` });
            await MessageBroker.publish(replyTo, result);
        } catch (e) {
            errorHandler('error', { family, name, request, error: e })
            if (replyTo !== undefined) await MessageBroker.publish(replyTo, { success: false, error_name: e.name })
        }
    }
    MessageBroker.subscribe(service_id, requestHandler);
    model.eventHandler('running', { family, name, message: `Running {${service_id}} MicroService...` });
}