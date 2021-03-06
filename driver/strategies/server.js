const { compare, basic: { isFunction, isString } } = require('../../core/validator');
const { driverError } = require('../../core/error');
const Model = require('../strategies/model');
module.exports = (server, { is_websocket, is_rest }) => (model, { rest = false, websocket = false, port, ...model_config }) => {
    const server_model = Model(model, model_config);
    const compare_result = compare.many([
        compare.basic(isFunction, server.listen),
        compare.basic(() =>
            (is_websocket
                && server.ws instanceof Function
                || !websocket)
            && (is_rest
                && server.rest instanceof Function
                || !rest),
            { is_websocket, is_rest, rest, websocket })
    ]);
    if (compare_result !== true) {
        throw driverError(`Server:${port}:${[!!rest ? 'REST' : null, !!websocket ? 'WEBSOCKET' : null].filter(isString).join('+')}`, `Initialization failed!`, compare_result)
    }
    if (!!websocket) server.ws(server_model.emit, server_model.on);
    if (!!rest) server.rest(server_model.emit);

    server_model.on('start', () => server.listen(port, server_model.emit))
    return server_model;
};