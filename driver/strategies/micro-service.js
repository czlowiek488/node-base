const { compare, basic: { isFunction, isString, isObject } } = require('../../core/validator');
const { driverError, apiError } = require('../../core/error');
const logger = require('../../core/logger');
module.exports = ({ MessageBroker, family, name, model }) => {
    const compare_result = compare.many([
        compare.onKeys({ family, name }, 'some', ['family', 'name'], isString),
        compare.onKeys({ model }, 'some', ['model'], isObject)
    ]);
    if (compare_result !== true) {
        throw driverError(`MicroService`, `Initialization Failed!`, compare_result)
    }
    const service_id = `${family}.${name}`;

    model.eventHandler('starting', { family, name, message: `Starting {${service_id}} MicroService...` });
    const requestHandler = async (request, replyTo) => {
        try {
            const { endpoint, data } = request;
            if (!isFunction(model[endpoint])) throw apiError(`MicroService:${service_id}`, 'model endpoint is missing', { missing_endpoint: endpoint, endpoints: Object.keys(model), request });
            const result = await model[endpoint](data);
            model.eventHandler('request', { family, name, message: `Request for {${name}.${endpoint}(${result}})` });
            if (replyTo !== undefined) await MessageBroker.publish(replyTo, result);
        } catch (e) {
            logger.error({ family, name, request, error: e })
            if (replyTo !== undefined) await MessageBroker.publish(replyTo, { success: false, error_name: e.name })
        }
    }
    MessageBroker.subscribe(service_id, requestHandler);
    model.eventHandler('running', { family, name, message: `Running {${service_id}} MicroService...` });
}