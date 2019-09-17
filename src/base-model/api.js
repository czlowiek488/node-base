const { compare, basic: { isFunction } } = require('../../core/validator');
const uWS = require('uWebSockets.js')
const Model = require('../../driver/strategies/model');
module.exports = (model, { rest = false, websocket = false, port }) => {
    const app = uWS.App({});

    const compare_result_start = compare.onKeys(model, 'some', ['apiHandler'], isFunction)
    if (compare_result_start !== true) {
        throw Error(`API INITIALIZATION FAILED! ${JSON.stringify(compare_result_start)}`)
    }

    if (!!websocket) {
        app.ws('/*', {
            maxPayloadLength: 1024,
            idleTimeout: 60 * 15,
            compression: 1,
            close: (ws, code, message) => { model.apiHandler('ws-close', ws, { message, code }) },
            open: (ws, req) => { model.apiHandler('ws-open', ws, req) },
            message: (ws, message, is_binary) => { model.apiHandler('ws-message', ws, { message, is_binary }) },
        });
    }
    if (!!rest) {
        app.post('/*', (res, req) => { model.apiHandler('rest-message', res, req) })
    }

    app.listen(port, token => {
        if (!!token) {
            model.apiHandler('listen');
        } else {
            throw Error(`API Listening Failed! ${JSON.stringify({ token })}`)
        }
    });
    return Model(model)
};