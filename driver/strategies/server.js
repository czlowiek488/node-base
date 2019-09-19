const { compare, basic: { isFunction, isString, isEqual } } = require('../../core/validator');
const { driverError } = require('../../core/error');
const logger = require('../../core/logger')
const Model = require('../strategies/model');
module.exports = (server, { is_websocket, is_rest }) => (model, { rest = false, websocket = false, port }) => {
    const compare_result = compare.many([
        compare.basic(isFunction, server.listen),
        compare.basic(isFunction, model.apiHandler),
        compare.basic(() =>
            (is_websocket
                && server.ws instanceof Function
                && model.wsHandler instanceof Function
                || !websocket)
            && (is_rest
                && server.post instanceof Function
                && model.restHandler instanceof Function
                || !rest),
            { is_websocket, is_rest, rest, websocket, wsHandler: model.wsHandler, restHandler: model.restHandler })
    ]);
    if (compare_result !== true) {
        throw driverError(`Server:${port}:${[!!rest ? 'REST' : null, !!websocket ? 'WEBSOCKET' : null].filter(isString).join('+')}`, `Initialization failed!`, compare_result)
    }
    if (!!websocket) server.ws(model.wsHandler);
    if (!!rest) server.post(model.restHandler);

    try { server.listen(port, model.apiHandler) }
    catch (e) { logger.error(e) }

    return Model(model)
};