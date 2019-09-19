const { compare, basic: { isFunction, isString, isObject } } = require('../../core/validator');
const { driverError } = require('../../core/error');
const logger = require('../../core/logger');
module.exports = ({ messageBroker, service_id, model }) => {
    const compare_result = compare.many([
        compare.basic(isString, service_id),
        compare.basic(isObject, model),
    ]);
    if (compare_result !== true) {
        throw driverError(`MicroService:${service_id}`, `Initialization Failed!`, compare_result)
    }
    model.eventHandler('starting', { service_id, message: `Starting {${service_id}} MicroService...` });
    const requestHandler = async (request, replyTo) => {
        try {
            const { endpoint, data } = request;
            if (!isFunction(model[endpoint])) throw driverError(`MicroService:${service_id}`, 'model endpoint is missing', { missing_endpoint: endpoint, endpoints: Object.keys(model), request });
            const result = await model[endpoint](data);
            model.eventHandler('request', { service_id, message: `Request for {${service_id}.${endpoint}(${result}})` });
            if (replyTo !== undefined) await messageBroker.publish(replyTo, result);
        } catch (e) {
            logger.error({ request, error: e })
            if (replyTo !== undefined) await messageBroker.publish(replyTo, { success: false, error_name: e.name })
        }
    }
    messageBroker.subscribe(service_id, requestHandler);
    model.eventHandler('running', { service_id, message: `Running {${service_id}} MicroService...` });
}