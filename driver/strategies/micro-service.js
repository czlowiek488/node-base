const { compare, basic: { isFunction, isString, isObject } } = require('../../core/validator');
const { driverError } = require('../../core/error');
const logger = require('../../core/logger');
module.exports = ({ messageBroker, model }) => {
    const compare_result = compare.basic(isObject, model)
    if (compare_result !== true) {
        throw driverError(`MicroService:${model.name}`, `Initialization Failed!`, compare_result)
    }
    model.emit('start', { message: `Starting ${model.name}!`, });
    const requestHandler = async (request, replyTo) => {
        const compare_result = compare.many([
            compare.basic(isString, request.endpoint),
            compare.basic(isObject, request.data),
        ]);
        if (compare_result !== true) {
            if (replyTo !== undefined) await messageBroker.publish(replyTo, { success: false, error_name: 'Invalid Request!' });
            return;
        }
        const { endpoint, data } = request;
        try {
            model.emit('request', endpoint, data);
            if (!isFunction(model[endpoint])) throw driverError(`MicroService:${model.name}`, 'model endpoint is missing', { missing_endpoint: endpoint, request, model });
            const result = await model[endpoint](data);
            if (replyTo !== undefined) await messageBroker.publish(replyTo, result);
        } catch (e) {
            logger.error(`MicroService:${model.name}`, { endpoint, data, error: e })
            if (replyTo !== undefined) await messageBroker.publish(replyTo, { success: false, error_name: e.name })
        }
    }
    messageBroker.subscribe(model.name, requestHandler);
    model.emit('run');
}