const { compare, basic: { isFunction, isString } } = require('../../core/validator');
const { driverError } = require('../../core/error');
const logger = require('../../core/logger')
const Model = require('../strategies/model');
module.exports = server => (model, { rest = false, websocket = false, port }) => {
    const compare_result = compare.many([
        compare.onKeys(server, 'some', ['ws', 'rest', 'listen'], isFunction),
    ]);
    if (compare_result !== true) {
        throw driverError(`Api:${port}:${[!!rest ? 'REST' : null, !!websocket ? 'WEBSOCKET' : null].filter(isString).join('+')}`, `Initialization failed!`, { compare_result })
    }
    if (!!websocket) server.ws(model.wsHandler);
    if (!!rest) server.post(model.restHandler);

    try { server.listen(port, model.apiHandler) }
    catch (e) { logger.error(e) }

    return Model(model)
};