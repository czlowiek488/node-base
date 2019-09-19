const { compare, basic: { isFunction, isString, isObject } } = require('../../core/validator');
const { driverError } = require('../../core/error');
const logger = require('../../core/logger');
module.exports = ({ messageBroker, family, name, model }) => {
    const service_id = `${family}.${name}`;
    const compare_result = compare.many([
        compare.onKeys({ family, name }, 'some', ['family', 'name'], isString),
        compare.onKeys({ model }, 'some', ['model'], isObject)
    ]);
    if (compare_result !== true) {
        throw driverError(`MicroService:${service_id}`, `Initialization Failed!`, compare_result)
    }
    model.eventHandler('starting', { service_id, family, name, message: `Starting {${service_id}} MicroService...` });
    const requestHandler = async (request, replyTo) => {
        try {
            const { endpoint, data } = request;
            if (!isFunction(model[endpoint])) throw driverError(`MicroService:${service_id}`, 'model endpoint is missing', { missing_endpoint: endpoint, endpoints: Object.keys(model), request });
            const result = await model[endpoint](data);
            model.eventHandler('request', { service_id, family, name, message: `Request for {${name}.${endpoint}(${result}})` });
            if (replyTo !== undefined) await messageBroker.publish(replyTo, result);
        } catch (e) {
            logger.error({ family, name, request, error: e })
            if (replyTo !== undefined) await messageBroker.publish(replyTo, { success: false, error_name: e.name })
        }
    }
    messageBroker.subscribe(service_id, requestHandler);
    model.eventHandler('running', { service_id, family, name, message: `Running {${service_id}} MicroService...` });
}